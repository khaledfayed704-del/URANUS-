// plugins/transcribe.js
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';
import fetch from 'node-fetch';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn }) => {
  // KILLUA REPLY OVERRIDE
  try {
    const _orig = m.reply.bind(m);
    m.reply = async (t, ...r) => {
      try {
        if (!t) return _orig(t, ...r);
        let txt = typeof t === 'string' ? t : (t.text || t.caption || '');
        if (!txt) return _orig(t, ...r);
        return await conn.sendMessage(m.chat, { text: String(txt) }, { quoted: _killuaFake });
      } catch { return _orig(t, ...r); }
    };
  } catch {}

  // فحص إذا كان فيه ملف صوت أو فيديو
  const isQuotedAudio = m.quoted && (m.quoted.mtype === 'audioMessage' || m.quoted.mtype === 'videoMessage');
  const isAudio = m.mtype === 'audioMessage' || m.mtype === 'videoMessage';
  
  if (!isQuotedAudio && !isAudio) {
    return conn.sendMessage(m.chat, { 
      text: '🎙️ أرسل ملف صوتي أو فيديو مع الأمر .نسخ\nمثال:\n`.نسخ` مع رفع ملف'
    }, { quoted: m });
  }
  
  await conn.sendMessage(m.chat, { 
    text: '⏳ جاري تحويل الصوت إلى نص...',
    react: { text: '🎙️', key: m.key }
  });
  
  try {
    let media;
    let mime;
    let filename;
    
    if (isQuotedAudio) {
      media = await m.quoted.download();
      mime = m.quoted.mimetype;
      filename = `audio_${Date.now()}.${mime.split('/')[1]}`;
    } else {
      media = await m.download();
      mime = m.mimetype;
      filename = `file_${Date.now()}.${mime.split('/')[1]}`;
    }
    
    const tempFilePath = join(tmpdir(), filename);
    await writeFile(tempFilePath, media);
    
    // 1. طلب رابط رفع
    const fileStats = await import('fs').then(fs => fs.statSync(tempFilePath));
    const fileSize = fileStats.size;
    const ext = filename.split('.').pop().toLowerCase();
    
    const signPayload = {
      filename: filename.replace(/\.[^/.]+$/, ''),
      fileType: ext,
      fileSize: fileSize,
      duration: 60,
      languageCode: 'ar',
      transcriptionType: 'transcript',
      enableSpeakerDiarization: false,
      forceUpload: true,
      providerHint: 'r2'
    };
    
    const signRes = await fetch('https://api.uniscribe.co/upload/generate-signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signPayload)
    });
    
    const signData = await signRes.json();
    
    if (!signData.preSignedUrl) {
      throw new Error('فشل في الحصول على رابط الرفع');
    }
    
    // 2. رفع الملف
    const fileStream = require('fs').createReadStream(tempFilePath);
    const uploadRes = await fetch(signData.preSignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': mime },
      body: fileStream
    });
    
    if (!uploadRes.ok) throw new Error('فشل في رفع الملف');
    
    // 3. بدء النسخ
    const transcribeRes = await fetch('https://api.uniscribe.co/tasks/transcription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptionFileId: signData.transcriptionFileId })
    });
    
    const transcribeData = await transcribeRes.json();
    
    if (!transcribeData.data?.taskId) {
      throw new Error('فشل في بدء عملية النسخ');
    }
    
    // 4. انتظار النتيجة (كل 3 ثواني لمدة 60 ثانية)
    let result = null;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts && !result) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusRes = await fetch(
        `https://www.uniscribe.co/transcriptions/${signData.transcriptionFileId}?_rsc=1`,
        { headers: { 'RSC': '1' } }
      );
      
      const text = await statusRes.text();
      
      if (text.includes('"status":"completed"') || text.includes('"text":')) {
        const textMatch = text.match(/text\\":\\"([^\\"]+)\\"/);
        if (textMatch) {
          result = textMatch[1];
          break;
        }
      }
      
      attempts++;
    }
    
    await unlink(tempFilePath).catch(() => {});
    
    if (result) {
      const finalText = result.length > 4000 ? result.substring(0, 3997) + '...' : result;
      await conn.sendMessage(m.chat, { 
        text: `✅ *تم النسخ بنجاح*\n\n📝 النص:\n${finalText}\n\n🎧 تم بواسطة UniScribe`
      }, { quoted: m });
    } else {
      throw new Error('انتهى وقت الانتظار');
    }
    
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { 
      text: `❌ *خطأ*\n\n${error.message || 'فشل في تحويل الملف'}\n\nيرجى المحاولة مرة أخرى`
    }, { quoted: m });
  }
};

handler.help = ['نسخ'];
handler.tags = ['tools'];
handler.command = /^(نسخ|تحويل|transcribe)$/i;

export default handler;
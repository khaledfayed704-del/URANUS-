// plugins/لصوت.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - تحويل الفيديو إلى صوت 🎵

import { promises as fs } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const execAsync = promisify(exec);

// دالة تحويل الفيديو إلى صوت باستخدام FFmpeg
async function convertToAudio(buffer, inputExt = 'mp4') {
    const tmpDir = join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    
    const timestamp = Date.now();
    const inputFile = join(tmpDir, timestamp + '.' + inputExt);
    const outputFile = join(tmpDir, timestamp + '.mp3');
    
    await fs.writeFile(inputFile, buffer);
    
    // تحويل الفيديو إلى MP3
    const cmd = `ffmpeg -i "${inputFile}" -vn -acodec libmp3lame -b:a 128k "${outputFile}" -y`;
    
    try {
        await execAsync(cmd, { timeout: 30000 });
    } catch (err) {
        console.log("[ᏌᏒ-ToAudio] FFmpeg warning:", err.message);
    }
    
    const resultBuffer = await fs.readFile(outputFile);
    
    await fs.unlink(inputFile).catch(() => {});
    await fs.unlink(outputFile).catch(() => {});
    
    return resultBuffer;
}

let handler = async (m, { conn, usedPrefix, command }) => {
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

    try {
        await m.react("⏳");

        // ✅ التحقق من وجود رد
        if (!m.quoted) {
            return conn.reply(m.chat, `>  🪐 *ᏌᏒ: "وحدة تحويل الفيديو لصوت"*\n> \n> 🎵 قم بالرد على فيديو لتحويله إلى صوت\n> 📌 *مثال:* ${usedPrefix + command} (رد على فيديو)`, m);
        }

        let quoted = m.quoted;
        
        // ✅ الحصول على المايم تايب بأمان
        let mime = '';
        try {
            if (quoted.mimetype) {
                mime = quoted.mimetype;
            } else if (quoted.msg && quoted.msg.mimetype) {
                mime = quoted.msg.mimetype;
            } else if (quoted.message?.videoMessage?.mimetype) {
                mime = quoted.message.videoMessage.mimetype;
            } else if (quoted.message?.audioMessage?.mimetype) {
                mime = quoted.message.audioMessage.mimetype;
            }
        } catch (err) {
            console.log("[ᏌᏒ-ToAudio] Error getting mimetype:", err);
        }

        if (!mime || !/video|audio/.test(mime)) {
            return conn.reply(m.chat, `>  🪐 *ᏌᏒ: "تنبيه"*\n> \n> 🎵 قم بالرد على فيديو لتحويله إلى صوت\n> 📌 *الملفات المدعومة:* فيديو أو صوت`, m);
        }

        // ✅ تحميل الميديا بأمان
        let media = null;
        try {
            if (quoted.download && typeof quoted.download === 'function') {
                media = await quoted.download();
            } else if (quoted.message?.videoMessage?.url) {
                const response = await fetch(quoted.message.videoMessage.url);
                media = Buffer.from(await response.arrayBuffer());
            } else if (quoted.message?.audioMessage?.url) {
                const response = await fetch(quoted.message.audioMessage.url);
                media = Buffer.from(await response.arrayBuffer());
            }
        } catch (err) {
            console.log("[ᏌᏒ-ToAudio] Error downloading media:", err);
        }

        if (!media || media.length < 100) {
            throw new Error('فشل تحميل الوسائط - الملف تالف أو غير مدعوم');
        }

        await m.reply('> 🔄 *ᏌᏒ: "جاري التحويل..."*\n> \n> 🎵 جاري تحويل الفيديو إلى صوت...');

        // ✅ التحويل باستخدام الدالة المدمجة
        let audioBuffer = await convertToAudio(media, 'mp4');
        
        if (!audioBuffer || audioBuffer.length < 1000) {
            throw new Error('حدث خطأ أثناء التحويل - الملف الناتج تالف');
        }

        await m.react("✅");

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            caption: `> ✅ *ᏌᏒ: "تم التحويل"*\n> \n> 🎵 تم تحويل الفيديو إلى صوت\n> 📁 الحجم: ${(audioBuffer.length / 1024).toFixed(2)} KB`
        }, { quoted: m });

    } catch (err) {
        await m.react("❌");
        console.error("[ᏌᏒ-ToAudio] Error:", err);
        
        let errorMsg = err.message || 'حدث خطأ غير متوقع';
        
        conn.reply(m.chat, `>  🪐 *ᏌᏒ: "فشل التحويل"*\n> \n> ⚠️ ${errorMsg}\n> 💡 تأكد من الرد على فيديو صالح`, m);
    }
};

handler.help = ['لصوت', 'tomp3'];
handler.tags = ['fun'];
handler.command = /^(لصوت|لفويس|tomp3)$/i;

export default handler;
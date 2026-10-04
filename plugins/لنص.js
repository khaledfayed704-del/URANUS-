// plugins/transcribe.js
import axios from 'axios';
import FormData from 'form-data';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const API_URL = 'https://2b.hidenfree.com';

async function uploadAudio(buffer) {
    const fd = new FormData();
    fd.append('file', buffer, { filename: 'audio_' + Date.now() + '.mp3' });
    fd.append('type', 'permanent');
    const r = await axios.post('https://tmp.malvryx.dev/upload', fd, {
        headers: fd.getHeaders(),
        timeout: 45000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
    });
    return r.data?.cdnUrl || r.data?.directUrl || null;
}

let handler = async (m, { conn, text }) => {
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

    let audioBuffer = null;

    if (m.quoted?.mtype === 'audioMessage' || m.quoted?.mediaType === 'audio') {
        audioBuffer = await m.quoted.download();
    }
    if (m.mtype === 'audioMessage' || m.mediaType === 'audio') {
        audioBuffer = await m.download();
    }

    if (!audioBuffer) {
        return m.reply('🎤 *تفريغ صوتي*\n\n📌 رد على رسالة صوتية');
    }

    await m.react('🎤');

    try {
        const audioUrl = await uploadAudio(audioBuffer);
        if (!audioUrl) throw new Error('فشل رفع الصوت');

        const result = await axios.get(`${API_URL}/api/transcribe/public`, {
            params: { api_key: 'free_key', url: audioUrl },
            timeout: 180000,
            validateStatus: () => true
        });

        const data = result.data;

        if (!data?.success || !data?.transcription) {
            throw new Error(data?.error || 'فشل التفريغ');
        }

        let msg = `📝 *التفريغ الصوتي*\n\n`;
        msg += `${data.transcription}\n\n`;
        if (data.language) msg += `🌍 اللغة: ${data.language}\n`;
        if (data.duration) msg += `⏱️ المدة: ${data.duration} ثانية`;

        await m.reply(msg);
        await m.react('✅');

    } catch (e) {
        console.error('[Transcribe]', e.message);
        await m.react('❌');
        m.reply('❌ ' + e.message);
    }
};

handler.command = /^(لنص|تفريغ|transcribe|نسخ)$/i;
handler.tags = ['ai'];
export default handler;
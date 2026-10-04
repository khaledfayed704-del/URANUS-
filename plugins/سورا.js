// plugins/aivideo2.js
import axios from 'axios';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const API_URL = 'https://2b.hidenfree.com';

let handler = async (m, { conn, text, command }) => {
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

    if (!text) return m.reply(`🎬 *Sora AI Video*\n\n📌 .سورا <وصف الفيديو>\n\n⏳ التوليد بياخد شوية`);

    let prompt = text;

    await m.react('🎬');
    let statusMsg = await m.reply('⏳ *جاري توليد الفيديو...*');

    try {
        const result = await axios.get(`${API_URL}/api/aivideo2/public`, {
            params: { api_key: 'free_key', prompt },
            timeout: 300000,
            validateStatus: () => true
        });

        const data = result.data;

        if (!data?.success || !data?.fileKey) {
            throw new Error(data?.error || 'فشل التوليد');
        }

        // ✅ تنزيل الفيديو
        const videoRes = await axios.get(`${API_URL}/api/aivideo2/download?file=${data.fileKey}`, {
            responseType: 'arraybuffer',
            timeout: 300000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: () => true
        });

        if (videoRes.status !== 200 || !videoRes.data || videoRes.data.length < 10000) {
            throw new Error('فيديو صغير');
        }

        const videoBuffer = Buffer.from(videoRes.data);
        const sizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);

        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch {}

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: `✅ *تم التوليد*\n🎬 ${prompt}\n📦 ${sizeMB} MB`
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[Sora]', e.message);
        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch {}
        await m.react('❌');
        m.reply('❌ ' + (e.message || 'فشل التوليد'));
    }
};

handler.command = /^(سورا|sora|ai_video2|aivideo2)$/i;
handler.tags = ['ai'];
export default handler;
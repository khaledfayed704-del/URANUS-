// plugins/anime-edit.js
// ⧼ ميدوريا⧽ - فيديو أنمي 🎬

import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// الفيديوهات المتاحة
const VIDEOS = [
     'https://files.catbox.moe/rc4x5s.mp4'
];

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


    await conn.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

    // اختيار فيديو عشوائي
    const randomVideo = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];

    try {
        // إرسال الفيديو
        await conn.sendMessage(m.chat, { 
            video: { url: randomVideo },
            ptv: true,
            caption: theme.build([
                { type: 'title', text: '🎬 فـيـديـو أنـمـي' },
                { type: 'divider' },
                { type: 'info', label: 'الـمـطـور', value: '༺youssf༻' }
            ])
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("خطأ:", e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, theme.build([
            { type: 'title', text: '❌ فـشـل الـتـحـمـيـل' },
            { type: 'subtitle', text: 'حدث خطأ أثناء إرسال الفيديو' },
            { type: 'divider' },
            { type: 'line', text: 'حاول مرة أخرى لاحقاً' }
        ]), m);
    }
};

handler.help = ['انمي'];
handler.tags = ['anime'];
handler.command = /^(ميدوريا|anime|انم)$/i;

export default handler;
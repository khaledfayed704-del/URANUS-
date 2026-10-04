// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/boti.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - معلومات المطور 🐧💞

let handler = async (m, { conn, isOwner, isROwner }) => {
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

    
    // ✅ التحقق من صلاحيات المطور
    if (!isROwner && !isOwner) {
        return m.reply(`🚫 *للأسف يا عزيزي، هذي الخاصية للمطورين فقط!*

👑 *المطور:* ${global.owner ? global.owner.map(o => '@' + o.split('@')[0]).join(', ') : 'EVIL'}

📌 *للتواصل مع المطور:* 
https://wa.me/${global.owner ? global.owner[0].split('@')[0] : 'رقم المالك'}

⭐ *Lynox Bot — EVIL Edition*`);
    }

    let message = `*مطوري🐧💞*`;

    await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
            mentionedJid: global.owner ? global.owner.map(o => o + '@s.whatsapp.net') : [],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: '🐧 EVIL · ᏞᎩᏁᎾ᙭ BOT',
                newsletterJid: 'ايدي القناة 5@newsletter'
            }
        }
    }, { quoted: m });
};

handler.help = ['بوتي', 'مطوري'];
handler.tags = ['owner', 'evil'];
handler.command = /^(بوتي|مطوري)$/i;
handler.owner = true;
handler.rowner = true;

export default handler;
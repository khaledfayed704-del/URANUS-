// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/lakabi.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - عرض لقبي 👥

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

    try {
        const groupId = m.chat;
        
        // التأكد من وجود قاعدة البيانات
        if (!global.db?.data?.users) {
            return m.reply('>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 قاعدة البيانات غير جاهزة');
        }
        
        const users = global.db.data.users;
        const user = users[m.sender];

        if (!user || !user.groups || !user.groups[groupId] || !user.groups[groupId].name) {
            return m.reply('>  🪐 *ᏌᏒ: "غير مسجل"*\n> \n> 🔮 أنت غير مسجل في هذه المجموعة\n> 📌 استخدم .حجز_لقب لتسجيل لقبك');
        }

        const nickname = user.groups[groupId].name;
        
        let msg = `>  🪐 *ᏌᏒ: "لقبك"*\n> \n> 🏷️ *اللقب:* ${nickname}\n> 👤 *الاسم:* ${m.pushName || m.sender.split('@')[0]}`;

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

    } catch (err) {
        console.error('[ᏌᏒ-Lakabi]', err);
        await m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 ${err.message || err}`);
    }
};

handler.help = ['لقبي'];
handler.tags = ['unions'];
handler.command = /^(لقبي|mynickname|nick)$/i;
handler.group = true;

export default handler;
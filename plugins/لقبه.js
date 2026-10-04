// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/lakabe.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - عرض لقب عضو 👥

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

    try {
        let mentionedJid;

        // تحديد العضو المستهدف
        if (m.quoted && m.quoted.sender) {
            mentionedJid = await conn.convertLidToRealJid(m.quoted.sender, m.chat);
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            mentionedJid = await conn.convertLidToRealJid(m.mentionedJid[0], m.chat);
        } else if (text) {
            const number = text.replace(/[^0-9]/g, '');
            if (number) {
                mentionedJid = number + '@s.whatsapp.net';
            }
        }

        if (!mentionedJid) {
            return m.reply('>  🪐 *ᏌᏒ: "وحدة عرض اللقب"*\n> \n> 👥 *الاستخدام:* .لقبه @العضو\n> 📌 أو رد على رسالة العضو');
        }

        // التأكد من وجود قاعدة البيانات
        if (!global.db?.data?.users) {
            return m.reply('>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 قاعدة البيانات غير جاهزة');
        }

        const users = global.db.data.users;
        const groupId = m.chat;
        const user = users[mentionedJid];

        if (!user || !user.groups || !user.groups[groupId]?.name) {
            let memberName = mentionedJid.split('@')[0];
            try {
                const nameFromConn = await conn.getName(mentionedJid);
                if (nameFromConn) memberName = nameFromConn;
            } catch(e) {}
            
            return m.reply(`>  🪐 *ᏌᏒ: "لا يوجد لقب"*\n> \n> 👤 ${memberName} لا يملك لقباً مسجلاً في هذه المجموعة`);
        }

        const nickname = user.groups[groupId].name;
        
        let memberName = mentionedJid.split('@')[0];
        try {
            const nameFromConn = await conn.getName(mentionedJid);
            if (nameFromConn) memberName = nameFromConn;
        } catch(e) {}

        let msg = `>  🪐 *ᏌᏒ: "لقب العضو"*\n> \n> 👤 *العضو:* ${memberName}\n> 🏷️ *اللقب:* ${nickname}`;

        await conn.sendMessage(m.chat, { text: msg, mentions: [mentionedJid] }, { quoted: m });

    } catch (err) {
        console.error('[ᏌᏒ-Lakabe]', err);
        await m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 ${err.message || err}`);
    }
};

handler.help = ['لقبه'];
handler.tags = ['unions'];
handler.command = /^(لقبه|nickname|lakabe)$/i;
handler.group = true;

export default handler;
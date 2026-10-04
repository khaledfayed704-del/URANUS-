// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/motawer.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - التحقق من توفر اللقب 👥

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
        const groupId = m.chat;
        const name = text?.trim();

        if (!name) {
            return m.reply('>  🪐 *ᏌᏒ: "وحدة التحقق من اللقب"*\n> \n> ✍️ *يرجى إدخال اللقب*\n> 📌 *مثال:* .متوفر الأسطورة');
        }

        // التأكد من وجود قاعدة البيانات
        if (!global.db?.data?.users) {
            return m.reply('>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 قاعدة البيانات غير جاهزة');
        }

        const users = global.db.data.users;
        let taken = false;
        let owner = null;

        for (let key in users) {
            const user = users[key];
            if (user.groups?.[groupId]?.name?.toLowerCase() === name.toLowerCase()) {
                taken = true;
                owner = key;
                break;
            }
        }

        if (taken) {
            let ownerName = owner.split('@')[0];
            try {
                const nameFromConn = await conn.getName(owner);
                if (nameFromConn) ownerName = nameFromConn;
            } catch(e) {}
            
            await conn.sendMessage(m.chat, { text: `>  🪐 *ᏌᏒ: "اللقب غير متاح"*\n> \n> ❌ *اللقب* "${name}" محجوز بالفعل\n> 👤 *بواسطة:* ${ownerName}` }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: `>  🪐 *ᏌᏒ: "اللقب متاح"*\n> \n> ✅ *اللقب* "${name}" متاح للحجز\n> 💡 *للحجز:* .حجز_لقب ${name}` }, { quoted: m });
        }

    } catch (err) {
        console.error('[ᏌᏒ-Motawer]', err);
        await m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 ${err.message || err}`);
    }
};

handler.help = ['متوفر <لقب>'];
handler.tags = ['unions'];
handler.command = /^(متوفر|available|check)$/i;
handler.group = true;

export default handler;
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/anti-contact.js
// 🧊 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓 - حذف جهة الاتصال وقفل الجروب دقيقة

if (!global.db) global.db = {};
if (!global.db.data) global.db.data = {};
if (!global.db.data.chats) global.db.data.chats = {};

const lockTimers = global.fanitasContactLock || (global.fanitasContactLock = {});

let handler = async (m, { usedPrefix, command, args }) => {
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

    if (!m.isGroup) return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 الأمر للجروب فقط.");

    const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {});
    const opt = (args[0] || "").toLowerCase();

    if (opt === "on" || opt === "اون" || opt === "تفعيل") {
        chat.anticontact = true;
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم تفعيل مضاد جهات الاتصال");
    }

    if (opt === "off" || opt === "اوف" || opt === "أوف" || opt === "تعطيل") {
        chat.anticontact = false;
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم تعطيل مضاد جهات الاتصال");
    }

    return m.reply(
        `🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n` +
        `💠 الحالة: ${chat.anticontact ? "شغال" : "مطفي"}\n\n` +
        `> \( {usedPrefix} \){command} اون\n` +
        `> \( {usedPrefix} \){command} اوف`
    );
};

handler.before = async function (m, { conn }) {
    try {
        if (!m.isGroup || m.fromMe || !m.message) return;

        const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {});
        if (!chat.anticontact) return;

        const type = m.mtype || Object.keys(m.message || {})[0];
        const isContact =
            type === "contactMessage" ||
            type === "contactsArrayMessage" ||
            !!m.message.contactMessage ||
            !!m.message.contactsArrayMessage ||
            !!m.message?.viewOnceMessage?.message?.contactMessage ||
            !!m.message?.ephemeralMessage?.message?.contactMessage ||
            !!m.message?.viewOnceMessage?.message?.contactsArrayMessage ||
            !!m.message?.ephemeralMessage?.message?.contactsArrayMessage;

        if (!isContact) return;

        const botJid = conn.decodeJid(conn.user.id);
        if (m.sender === botJid) return;

        await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});

        if (lockTimers[m.chat]) return;

        await conn.groupSettingUpdate(m.chat, "announcement");
        await conn.sendMessage(m.chat, {
            text: "🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم حذف جهة الاتصال\n🔮 الجروب اتقفل لمدة دقيقة"
        });

        lockTimers[m.chat] = setTimeout(async () => {
            try {
                await conn.groupSettingUpdate(m.chat, "not_announcement");
                await conn.sendMessage(m.chat, {
                    text: "🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم فتح الجروب"
                });
            } catch (e) {
                console.error("[FANITAS-UNLOCK]", e);
            } finally {
                delete lockTimers[m.chat];
            }
        }, 60 * 1000);
    } catch (e) {
        console.error("[FANITAS-ANTI-CONTACT]", e);
    }
};

handler.help = ["جهات"];
handler.tags = ["group"];
handler.command = /^(جهات|antikontak|مضادجهات)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
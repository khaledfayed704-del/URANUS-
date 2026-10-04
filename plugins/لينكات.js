// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/لينكات.js
// 🧊 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓 - حذف رسبوتيفايبوتيفايائل الروابط

if (!global.db) global.db = {};
if (!global.db.data) global.db.data = {};
if (!global.db.data.chats) global.db.data.chats = {};

const LINK_RE = /(?:https?:\/\/|www\.|wa\.me\/|t\.me\/|chat\.whatsapp\.com\/|youtu\.be\/|youtube\.com\/|instagram\.com\/|tiktok\.com\/|facebook\.com\/|fb\.com\/|twitter\.com\/|x\.com\/|discord\.gg\/)/i;

function getText(m) {
    return (
        m.text ||
        m.body ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.extendedTextMessage?.matchedText ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.documentMessage?.caption ||
        m.message?.buttonsMessage?.contentText ||
        ""
    );
}

function hasLink(m) {
    if (LINK_RE.test(getText(m))) return true;
    if (m.message?.groupInviteMessage) return true;
    if (m.message?.extendedTextMessage?.canonicalUrl) return true;
    const type = m.mtype || "";
    if (type === "groupInviteMessage") return true;
    return false;
}

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
        chat.antilink = true;
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم تفعيل حذف الروابط");
    }

    if (opt === "off" || opt === "اوف" || opt === "أوف" || opt === "تعطيل") {
        chat.antilink = false;
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 تم تعطيل حذف الروابط");
    }

    return m.reply(
        `🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n` +
        `💠 الحالة: ${chat.antilink ? "شغال" : "مطفي"}\n\n` +
        `> \( {usedPrefix} \){command} اون\n` +
        `> \( {usedPrefix} \){command} اوف`
    );
};

handler.before = async function (m, { conn }) {
    try {
        if (!m.isGroup || m.fromMe || !m.message) return;

        const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {});
        if (!chat.antilink) return;
        if (!hasLink(m)) return;

        const botJid = conn.decodeJid(conn.user.id);
        if (m.sender === botJid) return;

        await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
        console.error("[FANITAS-ANTILINK]", e);
    }
};

handler.help = ["لينكات"];
handler.tags = ["group"];
handler.command = /^(لينكات|antilink)$/i;
handler.admin = true;
handler.group = true;

export default handler;
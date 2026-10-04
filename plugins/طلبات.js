// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/طلبات.js
// 🧊 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓 - قبول الطلبات دفعة واحدة

let handler = async (m, { conn, args, usedPrefix, command }) => {
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

    if (!m.isGroup) {
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 الأمر للجروب فقط.");
    }

    const action = String(args[0] || "").toLowerCase();
    const max = parseInt(args.find(v => /^\d+$/.test(v))) || 0;

    if (action !== "قبول" && action !== "approve" && !max) {
        return m.reply(
            `🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n` +
            `💠 الاستخدام:\n` +
            `> \( {usedPrefix} \){command} قبول 200`
        );
    }

    if (!max) {
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 اكتب العدد، مثال:\n> .طلبات قبول 200");
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "💠", key: m.key } });

        const pending = await conn.groupRequestParticipantsList(m.chat);
        const list = Array.isArray(pending) ? pending : [];

        if (!list.length) {
            return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 مفيش طلبات انتظار.");
        }

        const targets = list
            .map(p => p.jid || p.id || p.participant)
            .filter(Boolean)
            .slice(0, max);

        const started = Date.now();
        const chunks = [];
        for (let i = 0; i < targets.length; i += 50) {
            chunks.push(targets.slice(i, i + 50));
        }

        await Promise.all(
            chunks.map(part => conn.groupRequestParticipantsUpdate(m.chat, part, "approve"))
        );

        const ms = Date.now() - started;
        await conn.sendMessage(m.chat, { react: { text: "🧊", key: m.key } });

        return m.reply(
            `🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n` +
            `💠 تم قبول ${targets.length} عضو\n` +
            `⚡ الوقت: ${ms}ms\n` +
            `🔮 المتبقي: ${Math.max(0, list.length - targets.length)}`
        );
    } catch (e) {
        console.error("[FANITAS-REQUESTS]", e);
        return m.reply("🧊 *𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓*\n💠 فشل القبول.\n" + (e.message || e));
    }
};

handler.help = ["طلبات قبول"];
handler.tags = ["group"];
handler.command = /^(طلبات)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
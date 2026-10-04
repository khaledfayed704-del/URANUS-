// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/anti-link.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - نظام منع الروابط 🔗

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 أمر التفعيل والتعطيل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let handler = async (m, { conn, text, isAdmin, isOwner }) => {
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


  // التحقق من المجموعة
  if (!m.isGroup) {
    return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 هذا الأمر يعمل فقط في المجموعات', m);
  }

  // التحقق من الصلاحيات
  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "صلاحيات غير كافية"*\n> \n> 🔮 هذا الأمر مخصص للمشرفين فقط', m);
  }

  // تهيئة قاعدة البيانات لو مش موجودة
  if (!global.db || !global.db.data) {
    global.db = { data: { chats: {} } };
  }
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = { 
      antiLink: false,
      warnings: {}
    };
  }

  let chat = global.db.data.chats[m.chat];

  // عرض الحالة الحالية
  if (!text) {
    const currentStatus = chat.antiLink ? '🟢 مُفعل' : '🔴 مُعطل';
    return conn.reply(m.chat, `>  🪐 *ᏌᏒ: "نظام منع الروابط"*\n> \n> 🔮 *الحالة:* ${currentStatus}\n> ⚠️ *التحذيرات:* 3 ثم طرد\n> \n> 📌 *الاستخدام:* .منع_الروابط تفعيل\n> 📌 *.منع_الروابط تعطيل*`, m);
  }

  // تفعيل النظام
  if (text === "تفعيل") {
    chat.antiLink = true;
    return conn.reply(m.chat, '> ✅ *ᏌᏒ: "تم التفعيل"*\n> \n> 🔗 *نظام منع الروابط*\n> 🟢 *الحالة:* مُفعلة\n> ⚠️ *التحذيرات:* 3 مخالفات ثم الطرد', m);
  }

  // تعطيل النظام
  if (text === "تعطيل") {
    chat.antiLink = false;
    return conn.reply(m.chat, '> ✅ *ᏌᏒ: "تم التعطيل"*\n> \n> 🔮 *تم إيقاف نظام منع الروابط*\n> 🔴 *الحالة:* مُعطلة', m);
  }

  return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 *استخدم:* تفعيل أو تعطيل', m);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 نظام التحذير والطرد التلقائي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

handler.before = async function (m, { conn, isBotAdmin, isAdmin }) {

  if (!m.isGroup) return;
  if (!m.text) return;

  if (!global.db || !global.db.data) {
    global.db = { data: { chats: {} } };
  }
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = { 
      antiLink: false,
      warnings: {}
    };
  }

  let chat = global.db.data.chats[m.chat];
  
  if (!chat.antiLink) return;
  if (!isBotAdmin) return;
  if (isAdmin) return;

  const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me|t\.me|telegram\.me|\.com|\.net|\.org)/i;

  if (linkRegex.test(m.text)) {

    if (!chat.warnings) chat.warnings = {};
    if (!chat.warnings[m.sender]) {
      chat.warnings[m.sender] = 0;
    }

    chat.warnings[m.sender]++;

    // حذف الرسالة المخالفة
    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.sender
        }
      });
    } catch (err) {
      console.error('[ᏌᏒ-AntiLink] فشل حذف الرسالة:', err);
    }

    // إذا وصل 3 تحذيرات → طرد
    if (chat.warnings[m.sender] >= 3) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        delete chat.warnings[m.sender];
        return await conn.reply(m.chat, '> 🚫 *ᏌᏒ: "تم الطرد"*\n> \n> 🔮 *السبب:* تكرار إرسال الروابط (3 مخالفات)', m);
      } catch (err) {
        console.error('[ᏌᏒ-AntiLink] فشل طرد العضو:', err);
        return await conn.reply(m.chat, '>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 فشل طرد العضو، تأكد من صلاحيات البوت', m);
      }
    }

    // إرسال تحذير عادي
    const remainingWarnings = 3 - chat.warnings[m.sender];
    return await conn.reply(m.chat, `> ⚠️ *ᏌᏒ: "تحذير من الروابط"*\n> \n> 🔮 *المخالفة:* ${chat.warnings[m.sender]}/3\n> ⚠️ *المتبقية:* ${remainingWarnings}\n> \n> 🔗 *يرجى عدم إرسال الروابط مرة أخرى*`, m);
  }
};

handler.help = ['منع_الروابط <تفعيل/تعطيل>'];
handler.tags = ['group'];
handler.command = /^منع_الروابط$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
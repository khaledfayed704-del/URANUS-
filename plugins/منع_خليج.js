// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/anti-gcc.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - نظام منع غير المصريين 🇪🇬

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

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "صلاحيات غير كافية"*\n> \n> 🔮 هذا الأمر مخصص للمشرفين فقط', m);
  }

  // التأكد من كتابة التفعيل أو التعطيل
  if (!text) {
    const currentStatus = global.db.data.settings?.[conn.user.jid]?.blockNonEgypt ? '🟢 مُفعل' : '🔴 مُعطل';
    return conn.reply(m.chat, `>  🪐 *ᏌᏒ: "نظام منع غير المصريين"*\n> \n> 🔮 *الحالة:* ${currentStatus}\n> \n> 📌 *الاستخدام:* .منع_الخليج [تفعيل/تعطيل]`, m);
  }

  // إنشاء الإعدادات لو غير موجودة
  if (!global.db.data.settings) global.db.data.settings = {};
  if (!global.db.data.settings[conn.user.jid]) {
    global.db.data.settings[conn.user.jid] = { blockNonEgypt: false };
  }

  let setting = global.db.data.settings[conn.user.jid];

  if (text === 'تفعيل') {
    setting.blockNonEgypt = true;
    return conn.reply(m.chat, '> ✅ *ᏌᏒ: "تم التفعيل"*\n> \n> 🇪🇬 *نظام منع غير المصريين*\n> 🟢 *الحالة:* مُفعلة', m);
  } 
  else if (text === 'تعطيل') {
    setting.blockNonEgypt = false;
    return conn.reply(m.chat, '> ✅ *ᏌᏒ: "تم التعطيل"*\n> \n> 🔮 *تم إيقاف نظام منع غير المصريين*\n> 🔴 *الحالة:* مُعطلة', m);
  } 
  else {
    return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 *استخدم:* تفعيل أو تعطيل', m);
  }
};

// ===============================
// 🔥 نظام الطرد التلقائي عند دخول أعضاء جدد
// ===============================

handler.before = async function (m, { conn, isBotAdmin }) {
  
  if (!m.isGroup) return;
  if (!m.message?.groupParticipantAdd) return;
  
  let setting = global.db.data.settings?.[conn.user.jid];
  if (!setting?.blockNonEgypt) return;
  
  if (!isBotAdmin) return;
  
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
  const botNumber = conn.user.jid;
  
  const newMembers = m.message.groupParticipantAdd;
  
  let removed = [];
  let removedNames = [];
  
  for (let user of newMembers) {
    if (user === botNumber) continue;
    if (user === groupOwner) continue;
    
    const number = user.split('@')[0];
    
    // السماح للأرقام المصرية فقط (كود مصر 20)
    if (number.startsWith('20')) continue;
    
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      removed.push(user);
      try {
        const contact = await conn.getName(user);
        removedNames.push(contact || number);
      } catch {
        removedNames.push(number);
      }
    } catch (err) {
      console.error('[ᏌᏒ-AntiGCC] فشل طرد العضو:', err);
    }
  }
  
  if (removed.length > 0) {
    let membersList = removedNames.join(', ');
    await conn.reply(m.chat, `> 🚫 *ᏌᏒ: "تم طرد أعضاء"*\n> \n> 🇪🇬 *تم طرد الأعضاء غير المصريين*\n> \n> 👤 *الأعضاء:* ${membersList}\n> 📊 *العدد:* ${removed.length}\n> \n> 🇪🇬 *المجموعة للمصريين فقط*`, m);
  }
};

handler.help = ['منع_الخليج <تفعيل/تعطيل>'];
handler.tags = ['group'];
handler.command = /^منع_الخليج$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
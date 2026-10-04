// plugins/ردود.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - وضع الردود 🎛️

import { ButtonV2 } from '../System/NIXCODE.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, isOwner, isROwner, isAdmin }) => {
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

  const chat = m.chat

  // المسموح لهم: المطور، أو أدمن الجروب (لو الأمر جوه جروب)
  const allowed = isOwner || isROwner || (m.isGroup && isAdmin)
  if (!allowed) {
    await conn.sendMessage(chat, { text: '⚠️ الأمر ده للمطور أو أدمنز الجروب بس.' }, { quoted: m })
    return
  }

  const currentSelfMode = !!global.opts['self']
  const currentAdminMode = !!global.db.data.chats[chat]?.modoadmin

  const statusText =
    `🎛️ *وضع ردود البوت الحالي*\n\n` +
    `👑 *وضع المطور فقط:* ${currentSelfMode ? '🟢 مفعّل' : '🔴 متوقف'}\n` +
    `🛡️ *وضع أدمنز الجروب فقط:* ${currentAdminMode ? '🟢 مفعّل' : '🔴 متوقف'}\n\n` +
    `اختر الوضع اللي عايزه من الأزرار تحت 👇`

  await conn.sendMessage(chat, { react: { text: '🎛️', key: m.key } })

  await new ButtonV2(conn)
    .setBody(statusText)
    .setFooter(global.watermark || '🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ')
    .setThumbnail('https://files.catbox.moe/3vlgrf.jpg')
    .addButton('👑 ◂◄ المطور فقط ►▸', '.ردود_تفعيل مطور')
    .addButton('🛡️ ◂◄ أدمنز الجروب فقط ►▸', '.ردود_تفعيل ادمن')
    .addButton('🌐 ◂◄ الكل (إلغاء التقييد) ►▸', '.ردود_تفعيل الكل')
    .send(chat, { quoted: m })
}

// ===== معالجة اختيار الزر =====
handler.before = async (m, { conn, isOwner, isROwner }) => {
  const chat = m.chat
  const text = (m.text || '').trim()
  const isAdmin = m.isAdmin || false

  if (!text.startsWith('.ردود_تفعيل ')) return

  const choice = text.split(/\s+/)[1]

  // بس المطور أو أدمن الجروب هو اللي يقدر يغيّر وضع الردود
  if (!isOwner && !isROwner && !isAdmin) {
    await conn.sendMessage(chat, { text: '⚠️ الأمر ده للمطور أو أدمنز الجروب بس.' }, { quoted: m })
    return true
  }

  if (choice === 'مطور') {
    global.opts['self'] = true
    if (global.db.data.chats[chat]) global.db.data.chats[chat].modoadmin = false
    await global.db.save().catch(() => {})
    await conn.sendMessage(chat, {
      text: '👑 *تم التفعيل!*\nالبوت هيرد على *المطور فقط* في كل مكان الآن.'
    }, { quoted: m })
    return true
  }

  if (choice === 'ادمن') {
    if (!m.isGroup) {
      await conn.sendMessage(chat, { text: '⚠️ الوضع ده بيشتغل جوه الجروبات بس.' }, { quoted: m })
      return true
    }
    global.opts['self'] = false
    if (!global.db.data.chats[chat]) global.db.data.chats[chat] = {}
    global.db.data.chats[chat].modoadmin = true
    await global.db.save().catch(() => {})
    await conn.sendMessage(chat, {
      text: '🛡️ *تم التفعيل!*\nالبوت هيرد على *أدمنز الجروب* بس (والمطور برضو) في الجروب ده.'
    }, { quoted: m })
    return true
  }

  if (choice === 'الكل') {
    global.opts['self'] = false
    if (global.db.data.chats[chat]) global.db.data.chats[chat].modoadmin = false
    await global.db.save().catch(() => {})
    await conn.sendMessage(chat, {
      text: '🌐 *تم الإلغاء!*\nالبوت هيرد على *الكل* عادي تاني.'
    }, { quoted: m })
    return true
  }

  return true
}

handler.help = ['ردود']
handler.tags = ['group']
handler.command = /^(ردود|ردود1|reply-mode)$/i

export default handler
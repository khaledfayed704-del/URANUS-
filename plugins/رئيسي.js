// plugins/رئيسي.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - البوت الرئيسي 👑

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

  const allowed = isOwner || isROwner || (m.isGroup && isAdmin)
  if (!allowed) {
    return conn.sendMessage(chat, { text: '⚠️ الأمر ده للمطور أو أدمنز الجروب بس.' }, { quoted: m })
  }

  if (!m.isGroup) {
    return conn.sendMessage(chat, { text: '⚠️ الأمر ده بيشتغل جوه الجروبات بس.' }, { quoted: m })
  }

  const currentPrimary = global.db.data.chats[chat]?.primaryBot || null
  const myJid = conn.decodeJid ? conn.decodeJid(conn.user?.id || conn.user?.jid || '') : (conn.user?.id || conn.user?.jid || '')
  const isMePrimary = currentPrimary === myJid

  const statusText =
    `👑 *البوت الرئيسي*\n\n` +
    `الحالة الحالية: ${currentPrimary ? (isMePrimary ? '🟢 بوت واحد بس (أنا الرئيسي)' : '🟡 بوت واحد بس (بوت تاني هو الرئيسي)') : '🔵 كل البوتات بترد'}\n\n` +
    `اختر من الأزرار تحت 👇`

  await conn.sendMessage(chat, { react: { text: '👑', key: m.key } })

  await new ButtonV2(conn)
    .setBody(statusText)
    .setFooter(global.watermark || '🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ')
    .setThumbnail('https://files.catbox.moe/3vlgrf.jpg')
    .addButton('👑 ◂◄ بوت واحد فقط (البوت ده) ►▸', `.رئيسي_تفعيل واحد ${myJid}`)
    .addButton('🌐 ◂◄ جميع البوتات ►▸', '.رئيسي_تفعيل الكل')
    .send(chat, { quoted: m })
}

// ===== معالجة اختيار الزر =====
handler.before = async (m, { conn, isOwner, isROwner }) => {
  const chat = m.chat
  const text = (m.text || '').trim()
  const isAdmin = m.isAdmin || false

  if (!text.startsWith('.رئيسي_تفعيل ')) return

  const allowed = isOwner || isROwner || (m.isGroup && isAdmin)
  if (!allowed) {
    await conn.sendMessage(chat, { text: '⚠️ الأمر ده للمطور أو أدمنز الجروب بس.' }, { quoted: m })
    return true
  }

  if (!m.isGroup) {
    await conn.sendMessage(chat, { text: '⚠️ الأمر ده بيشتغل جوه الجروبات بس.' }, { quoted: m })
    return true
  }

  const parts = text.split(/\s+/)
  const choice = parts[1]

  if (!global.db.data.chats[chat]) global.db.data.chats[chat] = {}

  if (choice === 'واحد') {
    const targetJid = parts[2] || (conn.decodeJid ? conn.decodeJid(conn.user?.id || conn.user?.jid || '') : (conn.user?.id || conn.user?.jid || ''))
    global.db.data.chats[chat].primaryBot = targetJid
    await global.db.save().catch(() => {})
    await conn.sendMessage(chat, {
      text: '👑 *تم التفعيل!*\n\nمن دلوقتي *بوت واحد بس* هو اللي هيرد على الأوامر في الجروب ده، حتى لو فيه بوتات فرعية تانية موجودة.'
    }, { quoted: m })
    return true
  }

  if (choice === 'الكل') {
    global.db.data.chats[chat].primaryBot = null
    await global.db.save().catch(() => {})
    await conn.sendMessage(chat, {
      text: '🌐 *تم التفعيل!*\n\nكل البوتات (الرئيسي + الفرعية) هترد على الأوامر في الجروب ده عادي.'
    }, { quoted: m })
    return true
  }

  return true
}

handler.help = ['رئيسي']
handler.tags = ['group', 'owner']
handler.command = /^(رئيسي|بوت_رئيسي|primary)$/i
handler.group = true

export default handler
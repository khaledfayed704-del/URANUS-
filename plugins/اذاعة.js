// plugins/broadcast.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - إذاعة الرسائل لكل الجروبات (البوت الرئيسي + السب بوتات) 📡

import { theme } from '../System/theme.js'
import ws from 'ws'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// تأخير بسيط بين كل إرسال وإرسال لتقليل خطر الحظر من واتساب
const DELAY_MS = 1500
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

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

  // لازم يكون في رسالة مردود عليها (quoted) عشان نعرف نبعتها
  if (!m.quoted) {
    return conn.reply(m.chat, theme.build([
      { type: 'title', text: '⚠️ تـنـبـيـه' },
      { type: 'subtitle', text: 'لازم ترد على الرسالة اللي عايز تذيعها' },
      { type: 'divider' },
      { type: 'line', text: 'الاستخدام: رد على رسالة واكتب .اذاعة' }
    ]), m)
  }

  await conn.sendMessage(m.chat, { react: { text: '📡', key: m.key } })

  // تجهيز قائمة كل الاتصالات: البوت الرئيسي + كل السب بوتات المتصلة
  const allConns = [conn]
  const subConns = Array.isArray(global.conns) ? global.conns : []
  for (const c of subConns) {
    const alive = c?.user && c?.ws?.socket && c.ws.socket.readyState !== ws.CLOSED
    if (alive && c !== conn && !allConns.includes(c)) allConns.push(c)
  }

  let sent = 0
  let failed = 0
  let totalGroups = 0

  for (const c of allConns) {
    let groups = {}
    try {
      groups = (await c.groupFetchAllParticipating()) || {}
    } catch {
      continue
    }

    const groupIds = Object.keys(groups)
    totalGroups += groupIds.length

    for (const jid of groupIds) {
      try {
        await c.copyNForward(jid, m.quoted.vM, true)
        sent++
      } catch {
        failed++
      }
      await sleep(DELAY_MS)
    }
  }

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  await conn.reply(m.chat, theme.build([
    { type: 'title', text: '📡 تـمـت الإذاعـة' },
    { type: 'divider' },
    { type: 'info', label: 'عـدد الـبـوتـات', value: allConns.length },
    { type: 'info', label: 'إجـمـالـي الـجـروبـات', value: totalGroups },
    { type: 'info', label: 'تـم الإرسـال', value: sent },
    { type: 'info', label: 'فـشـل', value: failed }
  ]), m)
}

handler.help = ['اذاعة']
handler.tags = ['owner']
handler.command = /^(اذاعة|إذاعة|broadcast)$/i
handler.owner = true

export default handler
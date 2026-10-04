// plugins/active.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - عرض الأعضاء النشطاء 🌐

import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, args }) => {
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
    let id = args?.[0]?.match(/\d+\-\d+@g.us/) || m.chat;
    
    if (!id.endsWith('@g.us')) {
      return m.reply('❌ هذا الأمر يستخدم فقط في المجموعات')
    }

    await conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } });

    // جلب جميع الرسائل المخزنة لهذه المجموعة
    const messages = conn.chats[id]?.messages || {}
    
    // استخراج المشاركين الفريدين من الرسائل
    const participantsSet = new Set()
    for (let msg of Object.values(messages)) {
      if (msg.key?.participant) {
        participantsSet.add(msg.key.participant)
      }
    }
    
    // ========== ✨ تحويل LID لرقم حقيقي ==========
    const participantsArray = []
    for (const jid of participantsSet) {
      try {
        const cleanJid = await conn.convertLidToRealJid(jid, id)
        participantsArray.push(cleanJid || jid)
      } catch {
        participantsArray.push(jid)
      }
    }
    
    const onlineList = participantsArray
      .sort((a, b) => a.split('@')[0].localeCompare(b.split('@')[0]))
      .map((k, i) => `│ *${i + 1}. @${k.split('@')[0]}*`)
      .join('\n') || '│ ✦ لا يوجد أعضاء نشطاء حالياً'

    let teks = `${theme.divider}\n│\n`
    teks += `│ 🌐 *قـائـمـة الأعـضـاء الـنـشـطـاء*\n`
    teks += `│  🪐 *المتصلين*\n│\n`
    teks += `${onlineList}\n│\n${theme.endDivider}`

    await conn.sendMessage(m.chat, { text: teks, mentions: participantsArray }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    m.reply(theme.build([
      { type: 'title', text: '❌ خـطـأ' },
      { type: 'error', text: 'حدث خطأ أثناء جلب الأعضاء النشطاء' }
    ]))
  }
}

handler.help = ['المتصلين']
handler.tags = ['group']
handler.command = /^(المتصلين|النشطين|active)$/i
handler.group = true

export default handler
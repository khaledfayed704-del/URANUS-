// plugins/hidetag.js
// ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ No.2 Type B - منشن مخفي 👥

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
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

    let fakegif = { 
        key: {participant: `0@s.whatsapp.net`, ...("ايدي الجروب" ? { remoteJid: "ايدي الجروب" } : {})},
        message: {"videoMessage": { "title": '🪉ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ', "h": `Hmm`,'seconds': '99999', 'gifPlayback': 'true', 'caption': '🪉ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ No.2 Type B 🪉', 'jpegThumbnail': true }}
    }
    let users = participants.map(u => conn.decodeJid(u.id))
    let q = m.quoted ? m.quoted : m || m.text
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text
    let msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c }}, { quoted: fakegif, userJid: conn.user.id }), text || q.text, conn.user.jid, { mentions: users })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notificar|مخفي)$/i
handler.group = true
handler.admin = true

export default handler
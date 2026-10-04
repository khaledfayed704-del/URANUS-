// plugins/kick.js
// ✧ Raiden Shogun ⧼ ᏞᎩᏁᎾ᙭ ⧽ - أمر الطرد 🚫

import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


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

  
  const developerNumbers = ['رقم المطور 4@s.whatsapp.net', 'رقم المطور 5@s.whatsapp.net']

  let user = m.mentionedJid?.[0] || m.quoted?.sender;
  
  if (!user) {
    return conn.reply(m.chat, theme.build([
      { type: 'title', text: '🚫 ᏌᏒ: "وحدة الطرد"' },
      { type: 'subtitle', text: 'قم بمنشن الهدف المراد طرده' },
      { type: 'divider' },
      { type: 'line', text: '⚔️ مثال: .طرد @user' },
      { type: 'line', text: '⚔️ أو قم بالرد على رسالة الهدف' }
    ]), m);
  }

  if (developerNumbers.some(dev => {
    let devClean = dev.replace(/[^0-9]/g, '');
    let userClean = user.replace(/[^0-9]/g, '');
    return userClean === devClean;
  })) {
    return conn.reply(m.chat, theme.build([
      { type: 'title', text: '⚠️ ᏌᏒ: "تحذير"' },
      { type: 'subtitle', text: 'لا يمكنك طرد قادة YoRHa' }
    ]), m, { mentions: [user] });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

  await conn.reply(m.chat, theme.build([
    { type: 'title', text: '✅ ᏌᏒ: "تم تنفيذ مهمة الطرد"' },
    { type: 'divider' },
    { type: 'info', label: '🎯 الهدف', value: '@' + user.split('@')[0] },
    { type: 'info', label: '👤 المنفذ', value: '@' + m.sender.split('@')[0] },
    { type: 'divider' },
    { type: 'line', text: '🚫 تم إخراج الهدف من المجموعة' }
  ]), m, { mentions: [m.sender, user] });
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'طرد']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler;
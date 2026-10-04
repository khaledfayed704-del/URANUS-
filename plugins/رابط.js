// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/رابط_الجروب.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - رابط المجموعة 🔗

const LINK_IMAGE = 'https://file.garden/aauvg01sjleV_ic1/79c0c2e640389275839611a46b4f3ec2.jpg'

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
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
    if (!m.isGroup) return global.dfail('group', m, conn)
    if (!isAdmin) return global.dfail('admin', m, conn)
    if (!isBotAdmin) return global.dfail('botAdmin', m, conn)

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let inviteCode = await conn.groupInviteCode(m.chat)
    let inviteLink = 'https://chat.whatsapp.com/' + inviteCode

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    
    await conn.sendMessage(m.chat, {
      image: { url: LINK_IMAGE },
      caption: `📌 *تفضل لينك الشات*\n\n🔗 ${inviteLink}\n\n⚡ *ᏌᏒ - LynoX bot*`
    }, { quoted: m })

  } catch (e) {
    console.error('[ᏌᏒ-رابط] خطأ:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ فشل جلب الرابط - تأكد من صلاحيات البوت')
  }
}

handler.command = /^(لينك|رابط_الجروب|invite|getlink|رابط|الرابط)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
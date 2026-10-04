// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/tagall.js
let handler = async (m, { conn, isAdmin, isOwner, isROwner }) => {
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

    if (!m.isGroup) return;
    if (!isAdmin && !isOwner && !isROwner) {
        global.dfail('admin', m, conn);
        return;
    }

    let groupData = conn.chats?.[m.chat];
    if (!groupData?.metadata?.participants) return m.reply('لا يمكن الوصول لبيانات المجموعة');

    let participants = groupData.metadata.participants;
    let mentions = participants.map(p => p.id);
    let tags = participants.map(p => '@' + p.id.split('@')[0]).join('\n');

    let text = `*👥 منشن جميع الأعضاء*\n\n${tags}`;
    let imageUrl = 'https://files.catbox.moe/3vlgrf.jpg';

    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: text, mentions });
};

handler.command = /^منشن$/i;
handler.group = true;
handler.admin = true;

export default handler;
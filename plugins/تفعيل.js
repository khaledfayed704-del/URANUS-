// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

let handler = async (m, { conn, isAdmin, isROwner, isOwner }) => {
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

  if (!m.isGroup) return m.reply(`🜲⃝☠️ *خطأ* ☠️⃝🜲\n👁️⃝🩸 للمجموعات فقط`)
  if (!isAdmin && !isROwner && !isOwner) return m.reply(`🜲⃝☠️ *خطأ* ☠️⃝🜲\n👁️⃝🩸 للأدمن فقط`)

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  global.db.data.chats[m.chat].alexAI = !global.db.data.chats[m.chat].alexAI
  
  await conn.sendMessage(m.chat, { text: global.db.data.chats[m.chat].alexAI 
    ? `🜲⃝☠️ *تم تفعيل اليكس* ☠️⃝🜲\n👁️⃝🩸 جندي النخبة جاهز\n𖤐⃝🩸 ${global.botName}`
    : `🜲⃝☠️ *تم إيقاف اليكس* ☠️⃝🜲\n𖤐⃝🩸 ${global.botName}` 
  }, { quoted: m })
}
handler.command = /^(اليكس|alex)$/i
handler.group = true
export default handler
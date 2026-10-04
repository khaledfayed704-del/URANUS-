// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/demoteall.js
// أمر تنزيل جميع المشرفين - مع اسبوتيفايبوتيفايتثناء مالك البوت

const handler = async (m, { conn, usedPrefix, command, isOwner, isROwner }) => {
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

  // 1. تحقق من أن الأمر في مجموعة
  if (!m.isGroup) {
    return m.reply('❌ هذا الأمر فقط للمجموعات.');
  }

  // 2. جلب بيانات المجموعة والمشاركين
  let groupMetadata;
  try {
    groupMetadata = await conn.groupMetadata(m.chat);
  } catch (e) {
    console.error(e);
    return m.reply('⚠️ تعذر الحصول على بيانات المجموعة.');
  }

  const participants = groupMetadata.participants;
  if (!participants || participants.length === 0) {
    return m.reply('⚠️ لا يوجد أعضاء في المجموعة.');
  }

  // 3. معرفات المسبوتيفايبوتيفايتثنيين
  const botId = conn.user.jid.replace(/:\d+/, '');
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';

  // ⭐ 4. تنزيل كل المشرفين ما عدا مالك البوت
  const botOwnerId = global.owner?.[0]?.[0]
    ? `${global.owner[0][0]}@s.whatsapp.net`
    : null;

  const adminsToDemote = participants
    .filter(p => p.admin)                          // المشرفين فقط
    .filter(p => p.id !== botOwnerId)              // اسبوتيفايبوتيفايتثناء مالك البوت
    .filter(p => p.id !== botId)                   // اسبوتيفايبوتيفايتثناء البوت نفسبوتيفايبوتيفايه
    .filter(p => p.id !== groupOwner)              // اسبوتيفايبوتيفايتثناء مالك المجموعة
    .map(p => p.id);

  if (adminsToDemote.length === 0) {
    return m.reply('⚠️ لا يوجد مشرفين قابلون للتنزيل (الكل مسبوتيفايبوتيفايتثنى).');
  }

  // 5. تنفيذ التنزيل دفعة واحدة
  try {
    await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote');
    m.reply(`✅ تم تنزيل ${adminsToDemote.length} مشرف/مشرفة بنجاح.\n🔒 تم اسبوتيفايبوتيفايتثناء: مالك البوت، البوت، ومالك المجموعة.`);
  } catch (error) {
    console.error('خطأ في تنزيل المشرفين:', error);
    m.reply(`❌ فشل في تنزيل المشرفين، تأكد من صلاحيات البوت (مشرف) وحاول مرة أخرى.\n${error.message || ''}`);
  }
};

// إعدادات الأمر
handler.help = ['demoteall'];
handler.tags = ['group'];
handler.command = ['تنزيل_الكل', 'demoteall', 'انزل_الكل'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.owner = false;

export default handler;
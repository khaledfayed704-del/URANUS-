// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/kickall.js
// أمر طرد جميع الأعضاء (فنش) - مع استثناء أرقام محددة

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

  // 3. معرفات المستثنيين
  const botId = conn.user.jid;
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
  
  // 🔒 قائمة الأرقام المحمية من الطرد (تم إضافة الرقم الثالث)
  const protectedNumbers = [
    'رقم محمي 1@s.whatsapp.net',  // الرقم الأول
    'رقم محمي 2@s.whatsapp.net',  // الرقم الثاني
    'رقم محمي 3@s.whatsapp.net',  // الرقم الثالث (الجديد)
    // يمكن إضافة المزيد هنا
  ];

  // 4. تصفية الأعضاء المراد طردهم (استثناء كل ما سبق)
  const toKick = participants
    .filter(p => p.id !== groupOwner)           // استثناء مالك المجموعة
    .filter(p => p.id !== botId)                // استثناء البوت نفسه
    .filter(p => !protectedNumbers.includes(p.id)) // استثناء الأرقام المحمية
    .map(p => p.id);

  if (toKick.length === 0) {
    return m.reply('⚠️ لا يوجد أعضاء قابلون للطرد (الكل مستثنى).');
  }

  // 5. تنفيذ الطرد دفعة واحدة
  try {
    await conn.groupParticipantsUpdate(m.chat, toKick, 'remove');
    m.reply(`✅ تم طرد ${toKick.length} عضو/عضوة بنجاح.\n🔒 تم استثناء: مالك المجموعة، البوت، والأرقام المحمية.`);
  } catch (error) {
    console.error('خطأ في الطرد:', error);
    m.reply(`❌ فشل في طرد الأعضاء، تأكد من صلاحيات البوت (مشرف) وحاول مرة أخرى.\n${error.message || ''}`);
  }
};

// إعدادات الأمر
handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = ['فنش', 'kickall'];
handler.group = true;
handler.admin = false;
handler.botAdmin = true;
handler.owner = true;

export default handler;
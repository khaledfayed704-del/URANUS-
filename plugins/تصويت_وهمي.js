// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/fake-vote.js
// أمر تصويت وهمي - مليون صوت فوري مع دعم متعدد اللغات

const handler = async (m, { conn, args, usedPrefix, command }) => {
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

  if (!m.isGroup) return m.reply('❌ هذا الأمر للمجموعات فقط.');

  // 1. تحديد لغة المستخدم
  const userLang = await getUserLanguage(m.sender, conn);
  const lang = userLang.includes('fr') ? 'fr' : 'ar';

  // 2. استخراج موضوع التصويت
  const topic = args.join(' ') || (lang === 'fr' ? 'Sondage mystère' : 'تصويت غامض');

  // 3. إنشاء خيارات عشوائية (أو يحددها المستخدم)
  const options = [
    { id: '1', ar: 'الخيار الأول', fr: 'Première option' },
    { id: '2', ar: 'الخيار الثاني', fr: 'Deuxième option' },
    { id: '3', ar: 'الخيار الثالث', fr: 'Troisième option' },
    { id: '4', ar: 'الخيار الرابع', fr: 'Quatrième option' }
  ];

  // 4. توليد أرقام وهمية (مليون صوت)
  const votes = options.map(() => ({
    count: Math.floor(Math.random() * 800000) + 200000 // بين 200 ألف و 1 مليون
  }));

  // تعديل الأرقام لتكون منطقية (مجموعها حوالي مليون)
  const totalVotes = 1000000;
  let remaining = totalVotes;
  votes.forEach((v, i) => {
    if (i === votes.length - 1) {
      v.count = remaining;
    } else {
      v.count = Math.floor(Math.random() * (remaining - (votes.length - i) * 1000)) + 1000;
      remaining -= v.count;
    }
  });

  // 5. إنشاء رسالة التصويت
  const messages = {
    ar: {
      title: '📊 *تصويت وهمي - مليون صوت!*',
      topic: `🗳️ *الموضوع:* ${topic}`,
      options: '📌 *الخيارات والنتائج:*',
      total: `✅ *إجمالي الأصوات:* ${totalVotes.toLocaleString()} صوت`,
      footer: '⚡ *تصويت وهمي للأغراض الترفيهية فقط*',
      note: '📌 جميع الأرقام وهمية ولا تعكس آراء حقيقية'
    },
    fr: {
      title: '📊 *Sondage fictif - Un million de votes!*',
      topic: `🗳️ *Sujet:* ${topic}`,
      options: '📌 *Options et résultats:*',
      total: `✅ *Total des votes:* ${totalVotes.toLocaleString()} votes`,
      footer: '⚡ *Sondage fictif à des fins de divertissement uniquement*',
      note: '📌 Tous les chiffres sont fictifs et ne reflètent pas de vraies opinions'
    }
  };

  const msg = messages[lang];

  // 6. بناء الرسالة النهائية
  let text = `${msg.title}\n\n`;
  text += `${msg.topic}\n\n`;
  text += `${msg.options}\n`;

  // إضافة الخيارات مع النسب المئوية
  options.forEach((opt, i) => {
    const count = votes[i].count;
    const percentage = ((count / totalVotes) * 100).toFixed(1);
    const bar = createProgressBar(percentage);
    const label = lang === 'fr' ? opt.fr : opt.ar;
    text += `\n${i+1}. *${label}*\n`;
    text += `   🗳️ ${count.toLocaleString()} صوت (${percentage}%)\n`;
    text += `   ${bar}\n`;
  });

  text += `\n${msg.total}`;
  text += `\n\n${msg.footer}`;
  text += `\n${msg.note}`;

  // 7. إرسال الرسالة مع أزرار تفاعلية
  const buttons = [
    { buttonId: '.نتيجة', buttonText: { displayText: lang === 'fr' ? '📊 Voir résultats' : '📊 عرض النتائج' }, type: 1 },
    { buttonId: '.تصويت_جديد', buttonText: { displayText: lang === 'fr' ? '🔄 Nouveau sondage' : '🔄 تصويت جديد' }, type: 1 }
  ];

  await conn.sendMessage(m.chat, {
    text: text,
    buttons: buttons,
    headerType: 1
  });

  // 8. حفظ التصويت في قاعدة البيانات
  global.db.data.fakeVotes = global.db.data.fakeVotes || {};
  const voteId = Date.now().toString(36);
  global.db.data.fakeVotes[voteId] = {
    topic: topic,
    options: options,
    votes: votes,
    total: totalVotes,
    creator: m.sender,
    time: Date.now(),
    lang: lang
  };
};

// دالة إنشاء شريط التقدم
function createProgressBar(percentage) {
  const barLength = 20;
  const filled = Math.round((percentage / 100) * barLength);
  const empty = barLength - filled;
  return `▰`.repeat(filled) + `▱`.repeat(empty);
}

// دالة تحديد لغة المستخدم
async function getUserLanguage(sender, conn) {
  try {
    // محاولة جلب لغة المستخدم من واتساب
    const userInfo = await conn.query({
      tag: 'iq',
      attrs: {
        to: 's.whatsapp.net',
        type: 'get',
        xmlns: 'w:profile'
      },
      content: [
        { tag: 'user', attrs: { jid: sender } }
      ]
    });
    
    // التحقق من وجود إعدادات اللغة
    if (userInfo && userInfo.content) {
      const settings = userInfo.content.find(c => c.tag === 'settings');
      if (settings && settings.attrs) {
        const lang = settings.attrs.locale || 'ar';
        return lang;
      }
    }
  } catch (e) {
    console.error('خطأ في جلب لغة المستخدم:', e);
  }
  
  // اللغة الافتراضية
  return 'ar';
}

// أمر عرض النتائج
const resultHandler = async (m, { conn }) => {
  if (!m.isGroup) return;
  
  // جلب آخر تصويت
  const votes = global.db.data.fakeVotes || {};
  const keys = Object.keys(votes);
  if (keys.length === 0) {
    return m.reply('⚠️ لا يوجد تصويتات سابقة.');
  }
  
  const lastVote = votes[keys[keys.length - 1]];
  const lang = lastVote.lang || 'ar';
  
  let text = lang === 'fr' ? '📊 *Résultats du dernier sondage*' : '📊 *نتائج آخر تصويت*';
  text += `\n🗳️ ${lastVote.topic}\n\n`;
  
  lastVote.options.forEach((opt, i) => {
    const count = lastVote.votes[i].count;
    const percentage = ((count / lastVote.total) * 100).toFixed(1);
    const label = lang === 'fr' ? opt.fr : opt.ar;
    text += `${i+1}. ${label}: ${count.toLocaleString()} (${percentage}%)\n`;
  });
  
  text += `\n✅ ${lang === 'fr' ? 'Total:' : 'الإجمالي:'} ${lastVote.total.toLocaleString()}`;
  
  await conn.sendMessage(m.chat, { text });
};

// أمر تصويت جديد
const newVoteHandler = async (m, { conn, args }) => {
  // نفس الكود الأساسي ولكن بدون حفظ التصويت القديم
  // يمكن إعادة استخدام الكود الرئيسي
};

// إعدادات الأوامر
handler.command = ['تصويت_وهمي', 'fakevote', 'vote'];
handler.group = true;
handler.admin = false;
handler.botAdmin = false;

resultHandler.command = ['نتيجة', 'result'];
resultHandler.group = true;

newVoteHandler.command = ['تصويت_جديد', 'newvote'];
newVoteHandler.group = true;

export { handler, resultHandler, newVoteHandler };
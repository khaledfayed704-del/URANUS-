// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/fun-stats.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - أوامر التسلية 🎭

let handler = async (m, { conn, command, text, usedPrefix }) => {
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


  const rand = (max) => Math.floor(Math.random() * (max + 1));

  // تحديد الاسم المستهدف
  let targetName = '';
  let targetJid = '';
  
  // حالة 1: منشن
  if (m.mentionedJid && m.mentionedJid[0]) {
    targetJid = await conn.convertLidToRealJid(m.mentionedJid[0], m.chat);
    try {
      targetName = await conn.getName(targetJid);
    } catch {
      targetName = targetJid.split('@')[0];
    }
  }
  // حالة 2: رد على رسالة
  else if (m.quoted && m.quoted.sender) {
    targetJid = await conn.convertLidToRealJid(m.quoted.sender, m.chat);
    try {
      targetName = await conn.getName(targetJid);
    } catch {
      targetName = targetJid.split('@')[0];
    }
  }
  // حالة 3: كتابة اسم/رقم مباشر
  else if (text && text.trim()) {
    const input = text.trim();
    if (/^\d+$/.test(input)) {
      targetJid = input + '@s.whatsapp.net';
      try { targetName = await conn.getName(targetJid); } catch { targetName = input; }
    } else {
      targetName = input;
    }
  }
  // حالة 4: لا يوجد هدف
  else {
    return m.reply(`>  🪐 *ᏌᏒ: "أمر ${command}"*\n> \n> 🎭 قم بمنشن الشخص أو كتابة اسمه أو رد على رسالته\n> 📌 *مثال:* ${usedPrefix + command} @user\n> 📌 *مثال:* ${usedPrefix + command} محمد`);
  }

  if (!targetName) targetName = 'المستخدم';

  const displayText = targetName;
  const randomPercent = rand(100);

  let reply = '';
  let emoji = '';

  switch (command) {
    case 'ورع':
      emoji = '🧒';
      reply = `>  🪐 *ᏌᏒ: "نسبة الورع"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'يا سلام ورع بمعنى الكلمة 😂' : 'لسه صغير واعد 🧒'}`;
      break;
      
    case 'اهبل':
      emoji = '🤪';
      reply = `>  🪐 *ᏌᏒ: "نسبة الهبل"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'اهبل بطل خلي بالك منه 😂' : 'لسه شاطر وواعي 🧠'}`;
      break;
      
    case 'خروف':
      emoji = '🐑';
      reply = `>  🪐 *ᏌᏒ: "نسبة الخرفنة"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'خروف والله يابو حمل 🐑' : 'لسه مش خروف كفاية 😅'}`;
      break;
      
    case 'جميل':
      emoji = '😍';
      reply = `>  🪐 *ᏌᏒ: "نسبة الجمال"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'فديت القمر 🌙' : 'جمالك جايب آخره ✨'}`;
      break;
      
    case 'ذكاء':
      emoji = '🧠';
      reply = `>  🪐 *ᏌᏒ: "نسبة الذكاء"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'عبقري بمعنى الكلمة 🧠' : 'ذكائك في ازدياد 📈'}`;
      break;
      
    case 'غباء':
      emoji = '🤦';
      reply = `>  🪐 *ᏌᏒ: "نسبة الغباء"*\n> \n> 👤 *الاسم:* ${displayText}\n> 📊 *النسبة:* ${randomPercent}%\n> 💬 ${randomPercent > 70 ? 'غبي بطل خلي بالك 🤦' : 'لسه فيه أمل 🤞'}`;
      break;
      
    default:
      reply = `>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 الأمر ${command} غير معروف`;
  }

  await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
  return m.reply(reply);
};

handler.help = ['ورع', 'اهبل', 'خروف', 'جميل', 'ذكاء', 'غباء'];
handler.tags = ['entertainment'];
handler.command = /^(ورع|اهبل|خروف|جميل|ذكاء|غباء)$/i;

export default handler;
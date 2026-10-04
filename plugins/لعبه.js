// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// plugins/game-rps-simple.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - لعبة حجر/ورق/مقص 🪨📄✂️

let cooldowns = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
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


  await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });

  if (!text) {
    return conn.reply(m.chat, `>  🪐 *ᏌᏒ: "لعبة حجر/ورق/مقص"*\n> \n> 🪨 *اختر أحد الخيارات:*\n> 📌 ${usedPrefix}${command} حجر\n> 📌 ${usedPrefix}${command} ورق\n> 📌 ${usedPrefix}${command} مقص`, m);
  }

  if (cooldowns[m.sender] && cooldowns[m.sender] > Date.now()) {
    let remainingTime = Math.ceil((cooldowns[m.sender] - Date.now()) / 1000);
    return conn.reply(m.chat, `> ⏰ *ᏌᏒ: "انتظر"*\n> \n> 🔮 انتظر ${remainingTime} ثانية`, m);
  }

  let botChoice = Math.random();
  if (botChoice < 0.34) botChoice = 'حجر';
  else if (botChoice > 0.34 && botChoice < 0.67) botChoice = 'مقص';
  else botChoice = 'ورق';

  let userChoice = text.toLowerCase();
  if (!['حجر', 'ورق', 'مقص'].includes(userChoice)) {
    return conn.reply(m.chat, '>  🪐 *ᏌᏒ: "اختيار غير صالح"*\n> \n> 🔮 اختر: حجر، ورق، أو مقص', m);
  }

  let result = '';
  if (userChoice === botChoice) result = 'تعادل 🤝';
  else if (
    (userChoice === 'حجر' && botChoice === 'مقص') ||
    (userChoice === 'مقص' && botChoice === 'ورق') ||
    (userChoice === 'ورق' && botChoice === 'حجر')
  ) result = 'فوز 🎉';
  else result = 'خسارة 😢';

  let title = result === 'فوز 🎉' ? 'ᏌᏒ: "فزت!"' : (result === 'خسارة 😢' ? 'ᏌᏒ: "خسرت!"' : 'ᏌᏒ: "تعادل!"');

  conn.reply(m.chat, `>  🪐 *${title}*\n> \n> 🪨 *أنت:* ${userChoice}\n> 🤖 *ᏌᏒ:* ${botChoice}\n> \n> ${result}`, m);

  cooldowns[m.sender] = Date.now() + 5000;
};

handler.command = /^(لعبة|حجر|ورق|مقص|rps)$/i;
handler.tags = ['game'];

export default handler;
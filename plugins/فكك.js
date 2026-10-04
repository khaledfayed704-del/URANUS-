// plugins/game-unscramble.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - لعبة فك الكلمة 🔤

import fs from "fs";
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let timeout = 60000;
let poin = 500;

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


    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    // التحقق من وجود مهمة نشطة
    if (id in conn.tekateki) {
        await m.react("⏳");
        return conn.reply(m.chat, theme.build([
            { type: 'title', text: '⚠️ ᏌᏒ: "تنبيه"' },
            { type: 'subtitle', text: 'هناك مهمة قائمة بالفعل، انتظر انتهاء الجولة!' }
        ]), m);
    }

    // التحقق من وجود ملف الأسئلة
    if (!fs.existsSync("./src/game/فكك.json")) {
        return m.reply(theme.build([
            { type: 'title', text: ' 🪐 ᏌᏒ: "خطأ"' },
            { type: 'warning', text: 'ملف الأسئلة غير موجود!' }
        ]));
    }

    let tekateki = JSON.parse(fs.readFileSync("./src/game/فكك.json"));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = theme.build([
        { type: 'title', text: '🔤 ᏌᏒ: "مهمة فك الكلمة"' },
        { type: 'spacer' },
        { type: 'line', text: `🔮 *${json.question}*` },
        { type: 'divider' },
        { type: 'info', label: '⏰ الوقت', value: `${(timeout / 1000).toFixed(0)} ثانية` },
        { type: 'info', label: '⭐ الجائزة', value: `${poin} نقطة` },
        { type: 'info', label: '👤 المحارب', value: `@${m.sender.split("@")[0]}` },
        { type: 'divider' },
        { type: 'line', text: '⚔️ أرسل الإجابة الآن!' }
    ]);

    let sent = await conn.reply(m.chat, caption, m, { mentions: [m.sender] });

    conn.tekateki[id] = [
        sent,
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, theme.build([
                    { type: 'title', text: '⏰ ᏌᏒ: "انتهى وقت المهمة"' },
                    { type: 'info', label: 'الإجابة الصحيحة', value: json.response }
                ]), sent);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];

    await m.react("✍️");
};

// 🔥 معالج الإجابات
handler.before = async (m, { conn }) => {
    let id = m.chat;
    if (!conn.tekateki || !conn.tekateki[id]) return false;
    if (!m.text) return false;
    
    let game = conn.tekateki[id];
    let json = game[1];
    let poin = game[2];
    
    // مقارنة الإجابة
    let userAnswer = m.text.trim().toLowerCase();
    let correctAnswer = json.response.toLowerCase();
    
    if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
        
        // إضافة نقاط
        if (!global.db.data.users[m.sender].points) {
            global.db.data.users[m.sender].points = 0;
        }
        global.db.data.users[m.sender].points += poin;
        
        await conn.reply(m.chat, theme.build([
            { type: 'title', text: '✅ ᏌᏒ: "إجابة صحيحة"' },
            { type: 'line', text: `🎉 أحسنت أيها المحارب! +${poin} نقطة` },
            { type: 'divider' },
            { type: 'info', label: 'الإجابة', value: json.response },
            { type: 'info', label: 'نقاطك', value: `${global.db.data.users[m.sender].points} نقطة` }
        ]), m);
        
        clearTimeout(game[3]);
        delete conn.tekateki[id];
        return true;
    }
    
    return false;
};

handler.help = ["فكك"];
handler.tags = ["game"];
handler.command = /^(فكك)$/i;

export default handler;
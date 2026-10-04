// plugins/couplepp.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B — صور كابلز 💑

import fetch from "node-fetch";
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

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // جلب قاعدة بيانات الصور من GitHub
    let res = await fetch("https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json");
    let data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply('>  🪐 *ᏌᏒ: "لا توجد بيانات"*\n> \n> 🔮 لم يتم العثور على صور الكابلز');
    }

    // اختيار زوج عشوائي من الصور (ولد + بنت)
    let cita = data[Math.floor(Math.random() * data.length)];

    // إرسال صورة الولد
    await conn.sendMessage(m.chat, {
      image: { url: cita.cowo },
      caption: `>  🪐 *ᏌᏒ: "صورة الولد"*\n> \n> 💑 كابلز - زوج من الصور`
    }, { quoted: m });

    // إرسال صورة البنت
    await conn.sendMessage(m.chat, {
      image: { url: cita.cewe },
      caption: `>  🪐 *ᏌᏒ: "صورة البنت"*\n> \n> 💑 كابلز - زوج من الصور`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error('[ᏌᏒ-CouplePP]', err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 ${err.message || 'حدث خطأ أثناء تحميل الصور'}`);
  }
};

handler.help = ['كابيلز'];
handler.tags = ['images'];
handler.command = /^(كابيلز|couplepp|تطقيم)$/i;

export default handler;
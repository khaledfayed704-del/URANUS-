// plugins/ping.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - قياس سرعة البوت ⚡

import { performance } from 'perf_hooks';
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

    
    // قياس سرعة الرياكشن
    let reactStart = Date.now();
    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });
    let reactEnd = Date.now();
    let reactSpeed = reactEnd - reactStart;
    
    // تحديد سرعة الرياكشن
    let reactStatus;
    if (reactSpeed < 80) reactStatus = '⚡ ممتازة جداً';
    else if (reactSpeed < 150) reactStatus = '✅ ممتازة';
    else if (reactSpeed < 300) reactStatus = '🟡 جيدة';
    else reactStatus = '🔴 بطيئة';
    
    await conn.reply(m.chat, theme.build([
        { type: 'title', text: '⚡ قـيـاس سـرعـة الـبـوت' },
        { type: 'divider' },
        { type: 'info', label: '⚡ سـرعـة الـريـاكـشـن', value: `${reactSpeed} ms (${reactStatus})` },
        { type: 'divider' },
        { type: 'line', text: `🟢 البوت يعمل بسرعة ${reactSpeed < 150 ? 'ممتازة' : reactSpeed < 300 ? 'جيدة' : 'بطيئة'}` }
    ]), m);
};

handler.help = ['قيس'];
handler.tags = ['tools'];
handler.command = /^(قيس|سرعة|بنج|ping|speed)$/i;

export default handler;
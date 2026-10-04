// plugins/ريستارت.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - إعادة التشغيل التلقائي 🔄

import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


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

  // ⬇️ لو كتب الوقت بس - تشغيل التايمر
  if (text && !isNaN(text)) {
    let minutes = parseInt(text)
    if (minutes < 1) minutes = 1
    
    // ⬇️ رسالة تأكيد
    await m.reply(theme.build([
      { type: 'title', text: '🔄 ᏌᏒ: "تم تفعيل إعادة التشغيل"' },
      { type: 'divider' },
      { type: 'info', label: '⏰ المدة', value: `${minutes} دقيقة` },
      { type: 'line', text: '⏳ سيتم إعادة تشغيل النظام تلقائياً' }
    ]))
    
    // ⬇️ ضبط التايمر
    setTimeout(() => {
      console.log('🔄 ᏌᏒ: إعادة تشغيل تلقائية...')
      process.exit(1) // يقفل البوت - المنصة هتشغله تاني
    }, minutes * 60 * 1000) // تحويل الدقائق لملي ثانية
    
  } else {
    // ⬇️ لو كتب الأمر بس - عرض المساعدة
    return m.reply(theme.build([
      { type: 'title', text: '🔄 ᏌᏒ: "وحدة إعادة التشغيل"' },
      { type: 'divider' },
      { type: 'line', text: '⚔️ *إعادة تشغيل تلقائي للنظام*' },
      { type: 'divider' },
      { type: 'info', label: '🔮 الاستخدام', value: `${usedPrefix + command} <الوقت بالدقائق>` },
      { type: 'spacer' },
      { type: 'info', label: '📌 أمثلة', value: '' },
      { type: 'line', text: `${usedPrefix + command} 30` },
      { type: 'line', text: `${usedPrefix + command} 60` },
      { type: 'line', text: `${usedPrefix + command} 120` },
      { type: 'divider' },
      { type: 'warning', text: `⚡ للإلغاء: ${usedPrefix + command} 0` }
    ]))
  }
}

handler.command = ['ريستارت', 'restart', 'اعاده', 'ريست', 'اعادة_تشغيل']
handler.help = ['ريستارت']
handler.tags = ['owner']
handler.owner = true

export default handler
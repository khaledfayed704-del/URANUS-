// plugins/translate.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - ترجمة النصوص 🌐

import axios from 'axios';
import { theme } from "../System/theme.js";
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const LANGUAGES = {
    'ar': 'العربية',
    'en': 'الإنجليزية',
    'fr': 'الفرنسية',
    'es': 'الإسبانية',
    'de': 'الألمانية',
    'it': 'الإيطالية',
    'pt': 'البرتغالية',
    'ru': 'الروسية',
    'zh': 'الصينية',
    'ja': 'اليابانية',
    'ko': 'الكورية',
    'tr': 'التركية',
    'fa': 'الفارسية',
    'ur': 'الأردية',
    'hi': 'الهندية'
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


    if (!text) {
        const langList = Object.entries(LANGUAGES)
            .map(([code, name]) => `▸ ${code} : ${name}`)
            .join('\n');
        
        return conn.reply(m.chat, theme.build([
            { type: 'title', text: '🌐 تـرجـمـة الـنـصـوص' },
            { type: 'divider' },
            { type: 'info', label: '📌 الاستخدام', value: `${usedPrefix + command} [لغة] [النص]` },
            { type: 'spacer' },
            { type: 'line', text: '🌍 *اللغات المتاحة:*' },
            { type: 'line', text: langList },
            { type: 'divider' },
            { type: 'info', label: '📝 مثال', value: `${usedPrefix + command} en السلام عليكم` },
            { type: 'info', label: '📝 مثال2', value: `${usedPrefix + command} ar Hello world` }
        ]), m);
    }

    try {
        await m.react("⏳");

        const parts = text.trim().split(/\s+/);
        let targetLang = parts[0]?.toLowerCase();
        let translateText = parts.slice(1).join(' ');

        if (!LANGUAGES[targetLang] || !translateText) {
            targetLang = 'ar';
            translateText = text;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(translateText)}`;
        const res = await axios.get(url, { timeout: 10000 });
        
        let translated = '';
        if (res.data && res.data[0]) {
            translated = res.data[0].map(item => item[0]).join('');
        }

        if (!translated) throw new Error('فشلت الترجمة');

        await m.react("✅");

        let sourceLang = 'auto';
        if (res.data[2] && res.data[2] !== targetLang) {
            sourceLang = res.data[2];
        }

        const sourceLangName = LANGUAGES[sourceLang] || sourceLang;
        const targetLangName = LANGUAGES[targetLang];

        conn.reply(m.chat, theme.build([
            { type: 'title', text: '🌐 نـتـيـجـة الـتـرجـمـة' },
            { type: 'divider' },
            { type: 'info', label: '📝 النص الأصلي', value: translateText.slice(0, 100) + (translateText.length > 100 ? '...' : '') },
            { type: 'info', label: `🔄 من ${sourceLangName}`, value: `إلى ${targetLangName}` },
            { type: 'divider' },
            { type: 'line', text: '📖 *الترجمة:*' },
            { type: 'line', text: translated.slice(0, 500) + (translated.length > 500 ? '...' : '') },
            { type: 'divider' },
            { type: 'line', text: ' 🪐 ✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧' }
        ]), m);

    } catch (err) {
        await m.react("❌");
        console.error("Translation error:", err);
        
        conn.reply(m.chat, theme.build([
            { type: 'title', text: '❌ فـشـل الـتـرجـمـة' },
            { type: 'divider' },
            { type: 'error', text: err.message || 'حدث خطأ أثناء الترجمة' },
            { type: 'divider' },
            { type: 'line', text: '💡 تأكد من اتصال الإنترنت وجرب مرة أخرى' }
        ]), m);
    }
};

handler.help = ['ترجم [لغة] [نص]'];
handler.tags = ['tools'];
handler.command = /^(ترجم|ترجمة|translate)$/i;

export default handler;
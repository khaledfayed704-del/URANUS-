// plugins/ai-analyze.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - تحليل الكود بالذكاء الاصطناعي 🤖

import fs from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import axios from 'axios'
import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// مفتاح API بتاعك
const GEMINI_API_KEY = 'مفتاح API'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

let handler = async (m, { conn, usedPrefix, command }) => {
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

    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
    }

    if (!m.quoted) {
        await react('❌')
        return m.reply(theme.build([
            { type: 'title', text: '🤖 ᏌᏒ: "وحدة تحليل الكود"' },
            { type: 'divider' },
            { type: 'line', text: '🔮 *تحليل الكود بالذكاء الاصطناعي*' },
            { type: 'divider' },
            { type: 'info', label: '⚔️ الاستخدام', value: '' },
            { type: 'line', text: '• رد على رسالة فيها كود JavaScript' },
            { type: 'line', text: `• اكتب: ${usedPrefix + command}` },
            { type: 'divider' },
            { type: 'info', label: '🛡️ المميزات', value: '' },
            { type: 'line', text: '• تحليل ذكي للأخطاء' },
            { type: 'line', text: '• اقتراحات للإصلاح' },
            { type: 'line', text: '• شرح المشاكل بالعربية' }
        ]))
    }

    let code = m.quoted.text || ''
    if (!code) {
        await react('❌')
        return m.reply(theme.build([
            { type: 'title', text: ' 🪐 ᏌᏒ: "خطأ"' },
            { type: 'warning', text: 'لا يوجد كود في الرسالة المقتبسة' }
        ]))
    }

    // تنظيف الكود
    code = code.replace(/```js/g, '').replace(/```javascript/g, '').replace(/```/g, '').trim()

    if (code.length < 5) {
        await react('❌')
        return m.reply(theme.build([
            { type: 'title', text: ' 🪐 ᏌᏒ: "خطأ"' },
            { type: 'warning', text: 'الكود قصير جداً أو غير صالح' }
        ]))
    }

    await react('🤖')
    await m.reply(theme.build([
        { type: 'title', text: '🤖 ᏌᏒ: "جاري تحليل الكود"' },
        { type: 'line', text: '⏳ يرجى الانتظار...' }
    ]))

    try {
        // تحليل الكود باستخدام Gemini AI
        const prompt = `أنت خبير في تحليل كود JavaScript. حلل الكود التالي وأخبرني:

1. هل يوجد أخطاء نحوية (Syntax Errors)؟ إذا وجد، اذكرها واشرحها.
2. هل يوجد أخطاء منطقية أو أخطاء محتملة أثناء التشغيل (Runtime Errors)؟
3. اقتراحات لتحسين الكود (إن وجدت).
4. شرح مبسط للكود.

الكود:
\`\`\`javascript
${code}
\`\`\`

أجب باللغة العربية، بشكل مختصر ومفيد.`

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            },
            { timeout: 30000 }
        )

        const analysis = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتم الحصول على تحليل'

        await react('✅')
        
        let resultMsg = theme.build([
            { type: 'title', text: '🤖 ᏌᏒ: "تقرير تحليل الكود"' },
            { type: 'divider' },
            { type: 'info', label: '📝 الكود المرسل', value: '' }
        ]);
        
        resultMsg += `\n\`\`\`js\n${code.length > 200 ? code.slice(0, 200) + '...' : code}\n\`\`\``;
        resultMsg += `\n` + theme.build([
            { type: 'divider' },
            { type: 'info', label: '🔍 نتيجة التحليل', value: '' }
        ]);
        resultMsg += `\n${analysis}`;

        if (resultMsg.length > 4096) {
            resultMsg = resultMsg.slice(0, 4000) + '\n\n... (مقطع)'
        }

        await m.reply(resultMsg)

    } catch (err) {
        await react('❌')
        console.error('[ᏌᏒ-AI] Error:', err)
        m.reply(theme.build([
            { type: 'title', text: ' 🪐 ᏌᏒ: "فشل تحليل AI"' },
            { type: 'warning', text: err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' },
            { type: 'divider' },
            { type: 'line', text: '💡 جرب مرة أخرى أو تحقق من المفتاح' }
        ]))
    }
}

handler.help = ['تحليل']
handler.tags = ['ai']
handler.command = /^(تحليل|ai|حلل|analyze)$/i

export default handler
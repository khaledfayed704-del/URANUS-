// plugins/claude.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B — كلود Claude 🤖

import { askOverChat, downloadMedia } from './ai-helper.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// إدارة المحادثات لكل مستخدم
const conversations = new Map();

// نظام التعليمات الخاص بـ Claude
const SYSTEM_PROMPT = `أنت Claude، مساعد ذكي متعدد المهارات من Anthropic.
شخصيتك:
- ودود ومتعاون وتحب تساعد
- بتشرح بطريقة بسيطة ومفهومة
- بتستخدم إيموجي عشان الكلام يبقى حيوي
- بترد بالعربي إلا لو حد كلمك بلغة تانية
- ردودك منظمة وواضحة
- اسمك Claude وانت جزء من بوت ᏌᏒ - LynoX bot`;

let handler = async (m, { conn, text, command }) => {
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
        // استخراج الصورة من الرسالة
        const imageBase64 = await downloadMedia(m);
        const hasImage = !!imageBase64;
        
        // السؤال هو النص المرسل
        let question = text;
        
        // لو فيه صورة ومافيش سؤال
        if (hasImage && !question) {
            question = "حلل هذه الصورة واشرح لي ماذا يوجد فيها بالتفصيل بالعربية";
        }
        
        // التحقق من وجود سؤال
        if (!question && !hasImage) {
            return m.reply('>  🪐 *ᏌᏒ: "وحدة Claude"*\n> \n> 🤖 *الاستخدام:* .كلود <سؤالك>\n> 🖼️ *مع صورة:* أرسل الصورة مع نص أو رد على صورة\n> 📌 *مثال:* .كلود اشرح لي الذكاء الاصطناعي');
        }

        await conn.sendMessage(m.chat, { react: { text: hasImage ? '🖼️' : '🧠', key: m.key } });
        
        const statusMsg = hasImage 
            ? '> 🖼️ *ᏌᏒ: "Claude يحلل الصورة..."*'
            : '> 🧠 *ᏌᏒ: "Claude يفكر..."*';
        await m.reply(statusMsg);

        // تحضير السؤال مع الصورة إن وجدت
        let finalPrompt = question;
        if (hasImage && imageBase64) {
            finalPrompt = `[الصورة مرفقة بصيغة Base64]\n${question}`;
        }
        
        // جلب تاريخ المحادثة (آخر 10 رسائل)
        let history = conversations.get(m.sender) || [];
        let context = '';
        if (history.length > 0) {
            context = history.map(h => `${h.role === 'user' ? 'المستخدم' : 'Claude'}: ${h.content}`).join('\n\n') + '\n\n';
        }
        
        const fullPrompt = context + finalPrompt;
        
        // استخدام askOverChat من الملف المساعد
        const response = await askOverChat(fullPrompt, SYSTEM_PROMPT, 'anthropic/claude-opus-4-6');
        
        if (!response) {
            throw new Error('لم يتم الحصول على رد');
        }
        
        // حفظ تاريخ المحادثة
        history.push({ role: "user", content: question });
        history.push({ role: "assistant", content: response });
        if (history.length > 20) {
            history = history.slice(-20);
        }
        conversations.set(m.sender, history);
        
        // تنظيف الرد
        let cleanResponse = response
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\n\n/g, '\n')
            .trim();
        
        const headerText = hasImage ? 'Claude (تحليل الصور)' : 'Claude';
        
        // تقسيم الرد الطويل
        const maxLength = 4096;
        if (cleanResponse.length > maxLength) {
            const parts = cleanResponse.match(new RegExp(`.{1,${maxLength}}`, 'g'));
            for (let i = 0; i < parts.length; i++) {
                const prefix = i === 0 ? '' : '(تابع) ';
                await conn.sendMessage(m.chat, {
                    text: `>  🪐 *ᏌᏒ: "${headerText}"*\n> \n> 💬 *سؤالك:* ${question.substring(0, 100)}${question.length > 100 ? '...' : ''}\n> \n> 📝 *الرد:* ${prefix}\n> ${parts[i]}`
                }, { quoted: m });
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: `>  🪐 *ᏌᏒ: "${headerText}"*\n> \n> 💬 *سؤالك:* ${question}\n> \n> 📝 *الرد:*\n> ${cleanResponse}`
            }, { quoted: m });
        }
        
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('[ᏌᏒ-Claude]', e);
        await m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🤖 ${e.message || 'حدث خطأ في Claude'}\n> 🔮 حاول مرة أخرى لاحقاً`);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
}

handler.help = ['كلود <سؤال>'];
handler.command = ['كلود', 'claude', 'Claude'];
handler.tags = ['ai'];

export default handler;
// commands/ai.js
import fetch from 'node-fetch';
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// تخزين جلسات المحادثة لكل مستخدم
const userSessions = new Map();

// توليد معرف جلسة فريد
function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// فك تشفير الرد من Base64 إن لزم
function decodeIfBase64(str) {
  try {
    // التحقق إذا كان النص يبدو كـ Base64
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Regex.test(str) && str.length % 4 === 0) {
      const decoded = Buffer.from(str, 'base64').toString('utf-8');
      // التحقق إذا كان النص الناتج مقروءاً
      if (/[\u0600-\u06FF\u0000-\u007F]/.test(decoded)) {
        return decoded;
      }
    }
    return str;
  } catch {
    return str;
  }
}

let handler = async (m, { conn, text, usedPrefix }) => {
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
    const responseText = theme.build([
      { type: 'title', text: 'الذكاء الاصطناعي - DeepAI' },
      { type: 'spacer' },
      { type: 'info', label: 'الاستخدام', value: `${usedPrefix}ai سؤالك هنا` },
      { type: 'info', label: 'مثال', value: `${usedPrefix}ai ما هو الذكاء الاصطناعي؟` },
      { type: 'spacer' },
      { type: 'divider' }
    ]);
    return conn.reply(m.chat, responseText, m);
  }

  try {
    // إظهار مؤشر الكتابة
    await conn.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

    // الحصول على جلسة المستخدم أو إنشاء جديدة
    let sessionId = userSessions.get(m.sender);
    if (!sessionId) {
      sessionId = generateSessionId();
      userSessions.set(m.sender, sessionId);
    }

    // بناء تاريخ المحادثة
    const chatHistory = [
      { role: "user", content: text }
    ];

    // إعداد الطلب
    const formData = new FormData();
    formData.append('chat_style', 'chat');
    formData.append('chatHistory', JSON.stringify(chatHistory));
    formData.append('model', 'deepseek-v3.2');
    formData.append('session_uuid', sessionId);
    formData.append('enabled_tools', JSON.stringify(["image_generator", "image_editor"]));

    // إرسال الطلب
    const response = await fetch('https://api.deepai.org/hacking_is_a_serious_crime', {
      method: 'POST',
      headers: {
        'api-key': 'quick-request-' + Date.now(),
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    // محاولة قراءة الرد كنص أولاً
    const responseText_raw = await response.text();
    
    let aiResponse = '';
    let modelUsed = 'DeepSeek V3.2';

    // محاولة تحليل JSON إن أمكن
    try {
      const jsonData = JSON.parse(responseText_raw);
      if (jsonData.output) {
        aiResponse = decodeIfBase64(jsonData.output);
      } else if (jsonData.text) {
        aiResponse = decodeIfBase64(jsonData.text);
      } else if (jsonData.response) {
        aiResponse = jsonData.response;
      } else if (jsonData.message) {
        aiResponse = jsonData.message;
      } else {
        aiResponse = decodeIfBase64(responseText_raw);
      }
    } catch (e) {
      // ليس JSON، استخدم النص مباشرة
      aiResponse = decodeIfBase64(responseText_raw);
    }

    // تنظيف الرد
    aiResponse = aiResponse
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // إزالة الأحرف غير المرئية
      .trim();

    if (!aiResponse || aiResponse.length < 5) {
      throw new Error('الرد فارغ أو غير صالح');
    }

    // تنسيق الرد
    const responseText = theme.build([
      { type: 'title', text: 'DeepAI Assistant' },
      { type: 'spacer' },
      { type: 'info', label: '📝 سؤالك', value: text.slice(0, 60) + (text.length > 60 ? '...' : '') },
      { type: 'spacer' },
      { type: 'divider' },
      { type: 'info', label: '🤖 الرد', value: aiResponse.slice(0, 1500) + (aiResponse.length > 1500 ? '\n\n...(مختصر)' : '') },
      { type: 'divider' },
      { type: 'info', label: '⚙️ النموذج', value: modelUsed },
      { type: 'info', label: '🆔 المعرف', value: sessionId.slice(0, 13) + '...' }
    ]);

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    conn.reply(m.chat, responseText, m);
    
  } catch (error) {
    console.error('خطأ في AI:', error);
    
    // رسالة خطأ بديلة باستخدام API آخر مجاني
    try {
      // محاولة استخدام API بديل مجاني (fallback)
      const fallbackResponse = await fetch('https://api.popcat.xyz/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          msg: text,
          owner: 'wa-bot',
          bot_name: 'DeepAI'
        })
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const errorText = theme.build([
          { type: 'title', text: '⚠️ تنبيه' },
          { type: 'spacer' },
          { type: 'info', label: 'ملاحظة', value: 'تم استخدام خدمة بديلة مؤقتاً' },
          { type: 'spacer' },
          { type: 'divider' },
          { type: 'info', label: '🤖 الرد', value: fallbackData.response || fallbackData.message || 'لم أستطع معالجة طلبك حالياً' }
        ]);
        return conn.reply(m.chat, errorText, m);
      }
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
    }
    
    const errorText = theme.build([
      { type: 'title', text: '❌ خطأ' },
      { type: 'spacer' },
      { type: 'info', label: 'السبب', value: error.message || 'حدث خطأ غير متوقع' },
      { type: 'spacer' },
      { type: 'error', text: 'يرجى المحاولة مرة أخرى لاحقاً' }
    ]);
    conn.reply(m.chat, errorText, m);
  }
};

handler.help = ['ai', 'deepai'];
handler.tags = ['ai'];
handler.command = /^(ai|deepai|اسال|ذكاء)$/i;

export default handler;
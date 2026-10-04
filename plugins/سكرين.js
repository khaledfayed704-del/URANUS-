// plugins/سكرين.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - سكرين شوت للمواقع 📸

import fetch from 'node-fetch';
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// قائمة سيرفرات حديثة ومجانية تماماً (أغلبها يعتمد على برمجيات مفتوحة المصدر)
const SCREENSHOT_APIS = [
  // 1. Microlink API (ممتاز وسريع جداً ومجاني)
  (url) => `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`,
  
  // 2. Pikwy (بديل قوي)
  (url) => `https://api.pikwy.com/v1/screenshot?t=1&w=1280&h=800&u=${encodeURIComponent(url)}`,
  
  // 3. PagePeeker (سيرفر قديم ومستقر جداً)
  (url) => `https://free.pagepeeker.com/v2/thumbs.php?size=x&url=${encodeURIComponent(url)}`,
  
  // 4. URLBox / Sizzling (نسخة التقاط سريعة عبر البروكسي)
  (url) => `https://image.thum.io/get/width/1280/crop/800/maxAge/1/${url.replace(/^https?:\/\//, '')}`,
  
  // 5. MiniProxy Render
  (url) => `https://render-tron.appspot.com/screenshot/${encodeURIComponent(url)}`
];

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
    return m.reply(theme.build([
      { type: 'title', text: '📸 ᏌᏒ: "وحدة التقاط الشاشة"' },
      { type: 'subtitle', text: 'لأي موقع أو صفحة' },
      { type: 'divider' },
      { type: 'info', label: '⚔️ الاستخدام', value: `${usedPrefix + command} رابط_الموقع` },
      { type: 'info', label: '📌 مثال', value: `${usedPrefix + command} google.com` }
    ]));
  }

  // تنظيف الرابط والتأكد من صيغته
  let url = text.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  await m.react('⏳');

  let success = false;
  
  for (let i = 0; i < SCREENSHOT_APIS.length; i++) {
    const screenshotUrl = SCREENSHOT_APIS[i](url);
    
    try {
      // نفحص إذا كان السيرفر يستجيب بصورة فعلاً
      const res = await fetch(screenshotUrl, { 
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      if (res.ok) {
        // قراءة الصورة كـ Buffer لضمان وصولها كاملة وعدم الاعتماد على رابط خارجي قد ينتهي صلاحيته
        const buffer = await res.buffer();
        
        if (buffer.length > 1000) { // التأكد أن الملف ليس خطأ نصي صغير
          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: theme.build([
              { type: 'title', text: '📸 ᏌᏒ: "تم التقاط الشاشة بنجاح"' },
              { type: 'info', label: '🌐 الهدف', value: url },
              { type: 'info', label: '⚙️ السيرفر', value: `Method #${i + 1}` }
            ])
          }, { quoted: m });
          
          success = true;
          await m.react('✅');
          break;
        }
      }
    } catch (e) {
      // إذا فشل سيرفر ننتقل للتالي صامتاً
      continue;
    }
  }
  
  // خطة الطوارئ الأخيرة لو كل السيرفرات فشلت (نستخدم محرك التحويل لجوجل)
  if (!success) {
    try {
      // الاعتماد على موقع ثانٍ وسيط يسحب لقطات شاشة مجانية
      const backupUrl = `https://api.screenshotmachine.com/?key=100346&url=${encodeURIComponent(url)}&device=desktop&dimension=1024x768&format=jpg`;
      const res = await fetch(backupUrl);
      if (res.ok) {
        const buffer = await res.buffer();
        await conn.sendMessage(m.chat, { image: buffer, caption: `📸 ᏌᏒ: "تم الالتقاط عبر سيرفر الطوارئ"\n🌐 ${url}` }, { quoted: m });
        await m.react('✅');
        success = true;
      }
    } catch (e) {
      // تجاهل الخطأ لإظهار رسالة الفشل النهائية
    }
  }

  if (!success) {
    await m.react('❌');
    m.reply(theme.build([
      { type: 'title', text: ' 🪐 ᏌᏒ: "فشل التقاط الشاشة"' },
      { type: 'warning', text: 'جميع السيرفرات المجانية لا تستجيب حالياً أو الموقع محمي ضد البوتات.' }
    ]));
  }
};

handler.help = ['سكرين'];
handler.tags = ['tools'];
handler.command = /^(سكرين|screen|screenshot)$/i;

export default handler;
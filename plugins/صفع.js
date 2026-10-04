// plugins/slap.js
// ⧼ ᏞᎩᏁᎾ᙭ ⧽v2 - أمر صفع 👋

import { sticker } from "../UR/sticker.js";
import fetch from "node-fetch";
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, args, usedPrefix, command }) => {
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

    let who;
    
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    } else {
        who = m.chat;
    }

    if (!who && m.isGroup) {
        await conn.sendMessage(m.chat, { react: { text: '✍️', key: m.key } });
        return m.reply(theme.build([
            { type: 'title', text: '👋 أمر صفع' },
            { type: 'spacer' },
            { type: 'warning', text: 'قم بمنشن الشخص الذي تريد صفعه' },
            { type: 'info', label: 'مثال', value: `${usedPrefix + command} @user` }
        ]));
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        let name;
        let name2 = await conn.getName(m.sender);
        
        if (who === m.chat) {
            name = "البوت";
        } else {
            name = await conn.getName(who);
        }
        
        // استخدام الرابط المباشر للصورة
        const imageUrl = 'https://file.garden/aauvg01sjleV_ic1/1e2aa53561775c82e3de6af8c8ffadc7.jpg';
        
        // تحميل الصورة
        const imgRes = await fetch(imageUrl);
        const imgBuffer = await imgRes.buffer();

        // إنشاء الملصق
        let stiker = await sticker(imgBuffer, null, `${name2} صفع ${name}`, `⧼ ᏞᎩᏁᎾ᙭ ⧽ v2`);
        
        await conn.sendMessage(m.chat, {
            sticker: stiker,
            contextInfo: { 
                forwardingScore: 200, 
                isForwarded: true,
                mentionedJid: [who]
            }
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(theme.build([
            { type: 'error', text: '❌ حدث خطأ أثناء تنفيذ الأمر' },
            { type: 'info', label: 'السبب', value: e.message || 'خطأ غير معروف' }
        ]));
    }
};

handler.help = ["صفع"];
handler.tags = ["fun"];
handler.command = /^(صفع|slap)$/i;

export default handler;
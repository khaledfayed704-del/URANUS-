// plugins/admin.js
// ✧ Raiden Shogun ⧼ ᏞᎩᏁᎾ᙭ ⧽ - ترقية أو إعفاء عضو 👑

import { theme } from '../System/theme.js';
import { sticker } from '../UR/sticker.js';
import fetch from 'node-fetch';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, usedPrefix, command, isAdmin, isOwner }) => {
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

    
    if (!isAdmin && !isOwner) {
        return m.reply(theme.build([
            { type: 'error', text: '⚠️ هذا الأمر مخصص للمشرفين فقط' }
        ]));
    }

    let user = null;
    
    // الطريقة 1: المنشن (@user)
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    }
    
    // الطريقة 2: الرد على رسالة
    if (!user && m.quoted && m.quoted.sender) {
        user = m.quoted.sender;
    }
    
    // الطريقة 3: رقم مباشر (اختياري)
    if (!user && m.text) {
        const numMatch = m.text.match(/(\d{10,15})/);
        if (numMatch) {
            user = numMatch[1] + '@s.whatsapp.net';
        }
    }
    
    if (!user) {
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        return m.reply(theme.build([
            { type: 'title', text: '👑 إدارة المشرفين' },
            { type: 'divider' },
            { type: 'line', text: '⚠️ استخدم إحدى الطرق التالية:' },
            { type: 'divider' },
            { type: 'info', label: '📌 منشن', value: `.${command} @user` },
            { type: 'info', label: '📌 رد', value: `رد على رسالة العضو` },
            { type: 'info', label: '📌 رقم', value: `.${command} رقم الهاتف` }
        ]));
    }

    // ✨ استخدم الـ user زي ما هو، سواء LID أو JID
    // محدش لمسه ولا حاول يحوله

    try {
        // ترقية عضو
        if (command.match(/^(ترقيه|رفع|ارفع|promote)$/i)) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            
            const imageUrl = 'https://file.garden/aauvg01sjleV_ic1/IMG-20260529-WA0354.jpg';
            const imgRes = await fetch(imageUrl);
            const imgBuffer = await imgRes.buffer();
            let stiker = await sticker(imgBuffer, null, ' 🪐 مبروك اصبحت مشرف', '✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧');
            
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
            
            const successMsg = theme.build([
                { type: 'title', text: '👑 تـم الـتـرقـيـة' },
                { type: 'divider' },
                { type: 'info', label: 'العضو', value: '@' + user.split('@')[0] },
                { type: 'line', text: '⚔️ أصبح مشرفاً في المجموعة' }
            ]);
            
            await conn.sendMessage(m.chat, { text: successMsg, mentions: [user] }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }
        
        // إعفاء عضو
        else if (command.match(/^(اعفاء|تنزيل|demote)$/i)) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
            
            const successMsg = theme.build([
                { type: 'title', text: '📉 تـم الإعـفـاء' },
                { type: 'divider' },
                { type: 'info', label: 'العضو', value: '@' + user.split('@')[0] },
                { type: 'line', text: '⚔️ تم إعفاء العضو من الإدارة' }
            ]);
            
            await conn.sendMessage(m.chat, { text: successMsg, mentions: [user] }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }
        
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(theme.build([
            { type: 'title', text: '❌ فـشـل الـعـمـلـيـة' },
            { type: 'error', text: e.message?.slice(0, 100) || 'خطأ غير معروف' }
        ]));
    }
};

handler.help = ['ترقيه', 'اعفاء'];
handler.tags = ['group'];
handler.command = /^(ترقيه|رفع|ارفع|promote|اعفاء|تنزيل|demote)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
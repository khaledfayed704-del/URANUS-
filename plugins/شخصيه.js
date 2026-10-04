// plugins/personality.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - تحليل الشخصية 🎭

import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, command, text, usedPrefix }) => {
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


    // تحديد الاسم المستهدف
    let targetName = '';
    let targetJid = '';
    
    if (m.mentionedJid && m.mentionedJid[0]) {
        // ✅ منشن مباشر - نستخدم convertLidToRealJid للتأكد من نظافة JID
        targetJid = await conn.convertLidToRealJid(m.mentionedJid[0], m.chat);
        try {
            targetName = await conn.getName(targetJid);
        } catch {
            targetName = targetJid.split('@')[0].replace(/[^0-9]/g, '');
        }
    } else if (m.quoted && m.quoted.sender) {
        // ✅ رد على رسالة
        targetJid = await conn.convertLidToRealJid(m.quoted.sender, m.chat);
        try {
            targetName = await conn.getName(targetJid);
        } catch {
            targetName = targetJid.split('@')[0].replace(/[^0-9]/g, '');
        }
    } else if (text && text.trim()) {
        // ✅ نص مكتوب - ممكن يكون رقم أو اسم
        const input = text.trim();
        
        // لو منشن بـ @ متبوع برقم
        if (input.startsWith('@') && /^\d+$/.test(input.slice(1))) {
            targetJid = input.slice(1) + '@s.whatsapp.net';
        }
        // لو رقم (بالأرقام بس)
        else if (/^\d+$/.test(input)) {
            targetJid = input + '@s.whatsapp.net';
        }
        // لو رقم بعلامة +
        else if (/^\+\d+$/.test(input)) {
            const num = input.replace(/[^0-9]/g, '');
            targetJid = num + '@s.whatsapp.net';
        }
        // لو اسم عادي
        else {
            targetName = input;
        }
        
        // ✅ لو عرفنا JID، نستخدم convertLidToRealJid للتأكد
        if (targetJid) {
            targetJid = await conn.convertLidToRealJid(targetJid, m.chat);
            try {
                targetName = await conn.getName(targetJid);
            } catch {
                targetName = targetJid.split('@')[0].replace(/[^0-9]/g, '');
            }
        }
    } else {
        await conn.sendMessage(m.chat, { react: { text: '✍️', key: m.key } });
        return m.reply(theme.build([
            { type: 'title', text: '🎭 ᏌᏒ: "وحدة تحليل الشخصية"' },
            { type: 'spacer' },
            { type: 'warning', text: 'قم بمنشن الشخص أو كتابة اسمه/رقمه أو الرد على رسالته' },
            { type: 'info', label: '📌 مثال', value: `${usedPrefix + command} @user` },
            { type: 'info', label: '📌 مثال', value: `${usedPrefix + command} محمد` },
            { type: 'info', label: '📌 مثال', value: `${usedPrefix + command} 201234567890` }
        ]));
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let stats = ['6%','12%','20%','35%','41%','49%','54%','60%','73%','84%','92%','99%','1%','0%'];
    
    let personalidad = theme.build([
        { type: 'title', text: `🎭 ᏌᏒ: "تقرير تحليل: ${targetName}"` },
        { type: 'spacer' },
        { type: 'info', label: '📊 المعنويات', value: pickRandom(stats) },
        { type: 'info', label: '📉 الأخلاق', value: pickRandom(stats) },
        { type: 'info', label: '🧠 الذكاء', value: pickRandom(stats) },
        { type: 'info', label: '🔥 الشجاعة', value: pickRandom(stats) },
        { type: 'info', label: '🎭 الشهرة', value: pickRandom(stats) },
        { type: 'info', label: '🔞 الانحراف', value: pickRandom(stats) },
        { type: 'divider' },
        { type: 'info', label: '🧩 نوع الشخصية', value: pickRandom(['ذو قلب طيب', 'متعجرف', 'سخي', 'متواضع', 'خجول', 'فضولي', 'ذكي جداً', 'هادئ', 'مغامر', 'حساس']) },
        { type: 'info', label: '⏳ الحالة الدائمة', value: pickRandom(['مشتت الانتباه', 'يشاهد الأنمي', 'على الهاتف دائماً', 'يفكر في المستقبل', 'يضيع الوقت', 'مبدع', 'نشيط', 'كسول']) },
        { type: 'info', label: '🚻 التوجه', value: pickRandom(['رجل', 'امرأة', 'مستقيم', 'فضائي 👽', 'شخصية أسطورية']) }
    ]);

    // ✅ إرسال مع منشن لو عرفنا الـ JID (متأكد إنه نظيف)
    const mentions = targetJid && targetJid.endsWith('@s.whatsapp.net') ? [targetJid] : [];
    await conn.sendMessage(m.chat, { text: personalidad, mentions }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['شخصية'];
handler.tags = ['fun'];
handler.command = /^(شخصية|شخصيه|تحليل)$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
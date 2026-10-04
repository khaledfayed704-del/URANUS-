// plugins/mute.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - كتم أو فك كتم عضو 🔇

import fetch from 'node-fetch';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, command, isAdmin }) => {
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

    if (!m.isGroup) return;
    if (!isAdmin) {
        return m.reply('>  🪐 *ᏌᏒ: "صلاحيات غير كافية"*\n> \n> ⚠️ فقط المشرفين يمكنهم تنفيذ هذا الأمر');
    }

    let targetJid = m.mentionedJid?.[0] || m.quoted?.sender;
    
    if (!targetJid) {
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        return m.reply(`>  🪐 *ᏌᏒ: "${command === 'كتم' ? 'أمر الكتم' : 'أمر فك الكتم'}"*\n> \n> ⚠️ قم بالرد على رسالة العضو أو منشنه\n> 📌 *للكتم:* رد على رسالة العضو ثم اكتب .كتم\n> 📌 *لفك الكتم:* رد على رسالة العضو ثم اكتب .فك_الكتم`);
    }

    // حماية البوت
    if (targetJid === conn.user.jid || targetJid === conn.user.lid) {
        return m.reply('>  🪐 *ᏌᏒ: "ممنوع"*\n> \n> ❌ لا يمكنك تنفيذ الأمر على البوت');
    }

    // حماية المطورين
    const ownerNumbers = global.owner.map(n => n.replace(/[^0-9]/g, ''));
    let targetNum = targetJid.replace(/[^0-9]/g, '');
    if (ownerNumbers.includes(targetNum)) {
        return m.reply('>  🪐 *ᏌᏒ: "ممنوع"*\n> \n> 👑 لا يمكن تنفيذ الأمر على قائد الوحدة');
    }

    // حماية مالك المجموعة
    try {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupOwner = groupMetadata.owner || '';
        if (targetJid === groupOwner || targetNum === groupOwner.replace(/[^0-9]/g, '')) {
            return m.reply('>  🪐 *ᏌᏒ: "ممنوع"*\n> \n> ❌ لا يمكنك تنفيذ الأمر على مالك المجموعة');
        }
    } catch (e) {}

    // التأكد من وجود قاعدة البيانات
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[targetJid]) {
        global.db.data.users[targetJid] = { muto: false };
    }

    let userData = global.db.data.users[targetJid];
    
    // الحصول على الاسم
    let targetName = targetJid.split('@')[0];
    try {
        const name = await conn.getName(targetJid);
        if (name && !name.match(/^\d+$/)) targetName = name;
    } catch (e) {}

    // كتم
    if (command === "كتم") {
        if (userData.muto === true) {
            return m.reply('>  🪐 *ᏌᏒ: "تنبيه"*\n> \n> ⚠️ هذا العضو مكتوم بالفعل');
        }
        userData.muto = true;
        await conn.sendMessage(m.chat, { react: { text: '🔇', key: m.key } });
        await conn.sendMessage(m.chat, { 
            text: `>  🪐 *ᏌᏒ: "تم كتم العضو"*\n> \n> 👤 *العضو:* @${targetJid.split('@')[0]}\n> 🔇 تم كتم العضو بنجاح`, 
            mentions: [targetJid] 
        }, { quoted: m });
    }
    // فك الكتم
    else if (command === "فك_الكتم") {
        if (userData.muto === false) {
            return m.reply('>  🪐 *ᏌᏒ: "تنبيه"*\n> \n> ⚠️ هذا العضو غير مكتوم');
        }
        userData.muto = false;
        await conn.sendMessage(m.chat, { react: { text: '🔊', key: m.key } });
        await conn.sendMessage(m.chat, { 
            text: `>  🪐 *ᏌᏒ: "تم فك كتم العضو"*\n> \n> 👤 *العضو:* @${targetJid.split('@')[0]}\n> 🔊 تم فك كتم العضو بنجاح`, 
            mentions: [targetJid] 
        }, { quoted: m });
    }
};

// معالج حذف الرسائل للمكتومين
handler.all = async function (m) {
    if (!m.isGroup || !global.db.data.users) return;
    if (!global.db.data.users[m.sender]) return;
    
    let user = global.db.data.users[m.sender];
    if (!user.muto) return;

    // لا تحذف رسائل المشرفين
    try {
        const groupMetadata = await this.groupMetadata(m.chat);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        if (admins.includes(m.sender)) return;
    } catch (e) {}

    // حذف الرسالة
    await this.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
        }
    }).catch(() => {});
};

handler.help = ['كتم', 'فك_الكتم'];
handler.command = /^(كتم|فك_الكتم)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
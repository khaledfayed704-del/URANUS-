// plugins/delete_lakab.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - حذف لقب عضو في المجموعة 👥

import { theme } from '../System/theme.js';
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

    try {
        let mentionedJid;

        // تحديد العضو المستهدف
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            mentionedJid = m.mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            mentionedJid = m.quoted.sender;
        } else if (text) {
            const number = text.replace(/[^0-9]/g, '');
            if (number) {
                mentionedJid = number + '@s.whatsapp.net';
            }
        }

        if (!mentionedJid) {
            return m.reply(theme.build([
                { type: 'title', text: '🗑️ حـذف لـقـب' },
                { type: 'divider' },
                { type: 'info', label: '📌', value: `${usedPrefix + command} @العضو` },
                { type: 'info', label: '📌', value: 'قم بالرد على رسالة العضو' }
            ]));
        }

        // ✅ استخدام convertLidToRealJid لتحويل LID لرقم حقيقي
        try {
            mentionedJid = await conn.convertLidToRealJid(mentionedJid, m.chat);
        } catch {}
        
        // لو لسه مش نظيف، ننضفه يدوي
        if (!mentionedJid || !mentionedJid.endsWith('@s.whatsapp.net')) {
            mentionedJid = String(mentionedJid || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        if (!global.db?.data?.users) {
            return m.reply(theme.build([
                { type: 'title', text: '❌ خـطـأ' },
                { type: 'error', text: 'قاعدة البيانات غير جاهزة' }
            ]));
        }

        const users = global.db.data.users;
        let user = users[mentionedJid];

        if (!user || !user.groups || !user.groups[m.chat] || !user.groups[m.chat].name) {
            return m.reply(theme.build([
                { type: 'title', text: '⚠️ تـنـبـيـه' },
                { type: 'line', text: 'هذا العضو لا يملك لقباً مسجلاً في هذه المجموعة.' }
            ]));
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        const oldName = user.groups[m.chat].name;
        delete user.groups[m.chat].name;

        if (global.db.writeData) {
            await global.db.writeData('users', mentionedJid, user).catch(() => {});
        }

        let memberName = mentionedJid.split('@')[0];
        try {
            const nameFromConn = await conn.getName(mentionedJid);
            if (nameFromConn) memberName = nameFromConn;
        } catch(e) {}

        let successMsg = theme.build([
            { type: 'title', text: '🗑️ تـم حـذف الـلـقـب' },
            { type: 'divider' },
            { type: 'info', label: '👤 العضو', value: memberName },
            { type: 'info', label: '🏷️ اللقب المحذوف', value: oldName }
        ]);

        await conn.sendMessage(m.chat, { text: successMsg, mentions: [mentionedJid] }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('حذف_لقب error:', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(theme.build([
            { type: 'title', text: '❌ خـطـأ' },
            { type: 'error', text: err.message || 'خطأ غير معروف' }
        ]));
    }
};

handler.help = ['حذف_لقب'];
handler.tags = ['unions'];
handler.command = /^(حذف-لقب|حذف_لقب|delete_lakab)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
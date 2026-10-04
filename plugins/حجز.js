// plugins/unions.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - نظام إدارة الألقاب في المجموعات 👥

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

    const groupId = m.chat;
    
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};
    
    let users = global.db.data.users;

    if (!users[m.sender]) users[m.sender] = {};
    if (!users[m.sender].groups) users[m.sender].groups = {};

    const user = users[m.sender];

    try {
        // ━━━━━━━ حجز اللقب ✍️ ━━━━━━━
        if (command === 'حجز_لقب') {
            if (!text) {
                return m.reply(theme.build([
                    { type: 'title', text: '✍️ حـجـز لـقـب' },
                    { type: 'info', label: '📌 مثال', value: `${usedPrefix + command} الأسطورة` }
                ]));
            }

            if (user.groups[groupId]?.name) {
                return m.reply(theme.build([
                    { type: 'title', text: '⚠️ مـوجـود' },
                    { type: 'info', label: 'لديك لقب محجوز', value: user.groups[groupId].name }
                ]));
            }

            for (let key in users) {
                if (users[key].groups?.[groupId]?.name?.toLowerCase() === text.toLowerCase()) {
                    return m.reply(theme.build([
                        { type: 'title', text: '❌ مـحـجـوز' },
                        { type: 'line', text: 'هذا اللقب محجوز مسبقاً' }
                    ]));
                }
            }

            await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            
            user.groups[groupId] = { 
                name: text, 
                regTime: Date.now(), 
                registered: true 
            };
            
            if (global.db.writeData) {
                await global.db.writeData('users', m.sender, user).catch(() => {});
            }
            
            await conn.sendMessage(m.chat, { 
                text: theme.build([
                    { type: 'title', text: '👥 تـم حـجـز الـلـقـب' },
                    { type: 'divider' },
                    { type: 'info', label: '🏷️ اللقب', value: text },
                    { type: 'info', label: '👤 بواسطة', value: m.pushName || m.sender.split('@')[0] },
                    { type: 'info', label: '📅 التاريخ', value: new Date().toLocaleDateString('ar-EG') }
                ])
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }

        // ━━━━━━━ قائمة الألقاب المحجوزة 📋 ━━━━━━━
        else if (command === 'الالقاب_المحجوزه') {
            let reservedNames = [];
            let mentions = [];

            for (let key in users) {
                const u = users[key];
                if (u.groups?.[groupId]?.name) {
                    reservedNames.push(`│ 🏷️ *${u.groups[groupId].name}* ⇽ @${key.split('@')[0]}`);
                    mentions.push(key);
                }
            }

            if (reservedNames.length === 0) {
                return m.reply(theme.build([
                    { type: 'title', text: '📋 قـائـمـة الـفـارغـة' },
                    { type: 'line', text: 'لا توجد ألقاب محجوزة حتى الآن' }
                ]));
            }

            let listMsg = `${theme.divider}\n│\n│ 👥 *قـائـمـة الألـقـاب الـمـحـجـوزة*\n│\n${reservedNames.join('\n')}\n│\n│ 📊 *المجموع:* ${reservedNames.length} لقب\n│\n${theme.endDivider}`;

            await conn.sendMessage(m.chat, { text: listMsg, mentions: mentions }, { quoted: m });
        }

        // ━━━━━━━ إلغاء حجز اللقب 🗑️ ━━━━━━━
        else if (command === 'الغاء_حجز') {
            if (!user.groups?.[groupId]?.name) {
                return m.reply(theme.build([
                    { type: 'title', text: '⚠️ تـنـبـيـه' },
                    { type: 'line', text: 'أنت لا تملك لقباً لإلغائه' }
                ]));
            }

            const oldName = user.groups[groupId].name;
            delete user.groups[groupId];

            if (global.db.writeData) {
                await global.db.writeData('users', m.sender, user).catch(() => {});
            }

            await conn.sendMessage(m.chat, { 
                text: theme.build([
                    { type: 'title', text: '🗑️ تـم إلـغـاء الـلـقـب' },
                    { type: 'divider' },
                    { type: 'info', label: '🏷️ اللقب السابق', value: oldName },
                    { type: 'info', label: '👤 بواسطة', value: m.pushName || m.sender.split('@')[0] }
                ])
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }

    } catch (err) {
        console.error('Unions error:', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(theme.build([
            { type: 'title', text: '❌ خـطـأ' },
            { type: 'error', text: err.message || 'خطأ غير معروف' }
        ]));
    }
};

handler.help = ['حجز_لقب', 'الالقاب_المحجوزه', 'الغاء_حجز'];
handler.tags = ['unions'];
handler.command = /^(حجز_لقب|الالقاب_المحجوزه|الغاء_حجز)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
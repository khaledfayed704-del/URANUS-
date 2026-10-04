// plugins/last30.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - عرض آخر 30 رسالة 📋

import PhoneNumber from 'awesome-phonenumber'
import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const handler = async (m, { conn, command }) => {
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

    if (!global.lastMessages || global.lastMessages.length === 0) {
        return m.reply(theme.build([
            { type: 'title', text: '📋 سـجـل الـرسـائـل' },
            { type: 'subtitle', text: 'لا توجد رسائل مسجلة بعد' },
            { type: 'divider' },
            { type: 'line', text: ' 🪐 سيبدأ التسجيل من الآن' }
        ]))
    }

    let logs = [...global.lastMessages].reverse()
    
    let text = `${theme.divider}\n`
    text += `│\n│ 📋 *آخر ${logs.length} رسالة من الـ Console*\n│\n`

    for (let i = 0; i < logs.length; i++) {
        let log = logs[i]
        
        // فك تشفير sender
        let senderJid = conn.decodeJid(log.sender || '')
        let senderNum = senderJid.split('@')[0]
        
        // محاولة تحويل الرقم لصيغة دولية
        let phoneNumber = ''
        try {
            if (senderNum && !isNaN(senderNum) && senderNum.length >= 10) {
                let pn = PhoneNumber('+' + senderNum)
                phoneNumber = pn.getNumber('international') || senderNum
            }
        } catch (e) {}
        
        let senderName = log.senderName || conn.getName(senderJid) || 'مجهول'
        let displaySender = phoneNumber || senderNum || 'مجهول'
        
        // فك تشفير chat
        let chatJid = conn.decodeJid(log.chat || '')
        let chatName = ''
        try {
            chatName = await conn.getName(chatJid)
        } catch (e) {
            chatName = chatJid.split('@')[0]
        }
        
        let chatType = log.isGroup ? '👥 جروب' : '💌 خاص'
        let msgText = log.text || log.body || '[وسائط/غير نصية]'
        
        // تقصير الرسالة لو طويلة
        if (msgText.length > 40) msgText = msgText.substring(0, 40) + '...'
        
        // تنسيق الوقت
        let time = new Date(log.time).toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        })
        
        text += `│\n│ *${i + 1}.* ⏰ ${time}\n`
        text += `│ 👤 *${senderName}*\n`
        text += `│ 📱 \`${displaySender}\`\n`
        text += `│ 📌 ${chatType} | *${chatName}*\n`
        text += `│ 💬 ${msgText}\n`
        
        // لو وصلنا 30 نتوقف
        if (i >= 29) break
    }

    text += `│\n${theme.endDivider}`

    // إرسال الرسالة
    await conn.sendMessage(m.chat, { text: text }, { quoted: m })

    // لو عاوز JSON مفصل
    if (m.text.includes('json') || m.text.includes('تفصيل')) {
        let jsonLogs = []
        for (let log of logs) {
            let senderJid = conn.decodeJid(log.sender || '')
            let chatJid = conn.decodeJid(log.chat || '')
            
            let phoneNumber = ''
            try {
                let pn = PhoneNumber('+' + senderJid.split('@')[0])
                phoneNumber = pn.getNumber('international') || ''
            } catch (e) {}
            
            jsonLogs.push({
                sender_raw: log.sender,
                sender_decoded: senderJid,
                sender_phone: phoneNumber,
                sender_name: log.senderName || conn.getName(senderJid),
                text: log.text || log.body,
                isGroup: log.isGroup,
                chat_raw: log.chat,
                chat_decoded: chatJid,
                chat_name: await conn.getName(chatJid).catch(() => ''),
                time: new Date(log.time).toISOString()
            })
        }
        
        let jsonText = '```json\n' + JSON.stringify(jsonLogs, null, 2).substring(0, 3500) + '\n```'
        await conn.sendMessage(m.chat, { text: jsonText }, { quoted: m })
    }
}

handler.help = ['اخر30']
handler.tags = ['owner']
handler.command = /^(اخر30|last30|logs)$/i
handler.owner = true
handler.rowner = true

export default handler
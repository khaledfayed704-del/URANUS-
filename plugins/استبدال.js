// plugins/replace.js
// ⛈️ Raiden Shogun - استبدال نص في جميع الملفات 🔄

import fs from 'fs'
import path from 'path'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { text, conn }) => {
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

    if (!text) return m.reply('⚡ *الاستخدام:*\n.استبدال <الكلمة القديمة> | <الكلمة الجديدة>')
    
    let parts = text.split('|')
    if (parts.length < 2) return m.reply('⚡ *الاستخدام:*\n.استبدال <الكلمة القديمة> | <الكلمة الجديدة>')
    
    let oldWord = parts[0].trim()
    let newWord = parts[1].trim()
    
    if (!oldWord || !newWord) return m.reply('❌ الكلمتين مطلوبتين')
    
    let foundFiles = []
    
    function walkDir(dir) {
        let files = fs.readdirSync(dir)
        for (let file of files) {
            let fullPath = path.join(dir, file)
            let stat = fs.statSync(fullPath)
            
            if (stat.isDirectory()) {
                if (file === 'node_modules' || file === '.git') continue
                walkDir(fullPath)
            } else if (file.endsWith('.js') || file.endsWith('.json')) {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8')
                    if (content.includes(oldWord)) {
                        foundFiles.push(fullPath.replace('.\\', '').replace('./', ''))
                    }
                } catch {}
            }
        }
    }
    
    walkDir('.')
    
    if (foundFiles.length === 0) {
        return m.reply(`❌ لم يتم العثور على *${oldWord}* في أي ملف`)
    }
    
    // تخزين البيانات مؤقتاً
    global.replaceData = global.replaceData || {}
    let sessionId = Date.now()
    global.replaceData[sessionId] = { oldWord, newWord, foundFiles }
    
    let fileList = foundFiles.map((f, i) => `├ ${i + 1}. ${f}`).join('\n')
    
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { 
                        text: `🔄 *استبدال*\n\n🔍 *الكلمة القديمة:* ${oldWord}\n✨ *الكلمة الجديدة:* ${newWord}\n\n📁 *الملفات (${foundFiles.length}):*\n${fileList}`
                    },
                    footer: { text: '⛈️ Raiden Shogun ⚡' },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '✅ تأكيد الاستبدال',
                                    id: `.replace_confirm ${sessionId}`
                                })
                            },
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '❌ إلغاء',
                                    id: `.replace_cancel ${sessionId}`
                                })
                            }
                        ],
                        messageParamsJson: ''
                    }
                })
            }
        }
    }, { userJid: conn.user.jid, quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

// أمر التأكيد والإلغاء مدمجين
handler.before = async function (m, { conn }) {
    let text = m.text || ''
    
    if (text.startsWith('.replace_confirm ')) {
        let sessionId = text.replace('.replace_confirm ', '').trim()
        if (!sessionId) return
        
        let data = global.replaceData?.[sessionId]
        if (!data) {
            await conn.sendMessage(m.chat, { text: '⏰ انتهت صلاحية الجلسة' }, { quoted: m })
            return
        }
        
        let { oldWord, newWord, foundFiles } = data
        
        let changedCount = 0
        for (let filePath of foundFiles) {
            try {
                let content = fs.readFileSync(filePath, 'utf8')
                if (content.includes(oldWord)) {
                    let newContent = content.replace(new RegExp(oldWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newWord)
                    fs.writeFileSync(filePath, newContent)
                    changedCount++
                }
            } catch {}
        }
        
        delete global.replaceData[sessionId]
        
        await conn.sendMessage(m.chat, { 
            text: `✅ *تم الاستبدال*\n\n🔍 *${oldWord}* ➜ *${newWord}*\n📁 *عدد الملفات:* ${changedCount}/${foundFiles.length}` 
        }, { quoted: m })
    }
    
    if (text.startsWith('.replace_cancel ')) {
        let sessionId = text.replace('.replace_cancel ', '').trim()
        if (!sessionId) return
        
        if (global.replaceData?.[sessionId]) {
            delete global.replaceData[sessionId]
        }
        
        await conn.sendMessage(m.chat, { text: '❌ *تم إلغاء الاستبدال*' }, { quoted: m })
    }
}

handler.command = ['استبدال', 'replace']
handler.tags = ['owner']
handler.owner = true

export default handler
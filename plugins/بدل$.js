/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓
┃ الوظيفة: استبدال نص داخل البلوجينات
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('✅ بلوجين بدل FANITAS BOT تم تحميله')

function findFileUpward(filename) {
    let currentDir = __dirname

    for (let i = 0; i < 6; i++) {
        const possiblePath = path.join(currentDir, filename)

        if (fs.existsSync(possiblePath)) {
            return possiblePath
        }

        const parentDir = path.dirname(currentDir)

        if (parentDir === currentDir) break

        currentDir = parentDir
    }

    return null
}

async function loadSettings() {
    try {
        const settingsPath = findFileUpward('settings.js')

        if (!settingsPath) {
            console.warn('⚠️ لم يتم العثور على settings.js')
            return {}
        }

        const settingsModule = await import(
            `${pathToFileURL(settingsPath).href}?update=${Date.now()}`
        )

        return settingsModule.default || settingsModule
    } catch (error) {
        console.error('❌ فشل تحميل settings.js:', error)
        return {}
    }
}

function collectValues(value, result = []) {
    if (!value) return result

    if (Array.isArray(value)) {
        for (const item of value) {
            collectValues(item, result)
        }

        return result
    }

    if (typeof value === 'object') {
        const possibleKeys = [
            'id',
            'jid',
            'number',
            'phone',
            'owner',
            'developer',
            'developers'
        ]

        let found = false

        for (const key of possibleKeys) {
            if (value[key]) {
                collectValues(value[key], result)
                found = true
            }
        }

        if (!found) {
            for (const item of Object.values(value)) {
                collectValues(item, result)
            }
        }

        return result
    }

    result.push(String(value))

    return result
}

function normalizeJid(value) {
    if (!value) return null

    let jid = String(value).trim()

    if (!jid) return null

    // إذا كان المطور محفوظًا بصيغة JID، نحافظ عليه
    if (jid.includes('@')) {
        return jid
    }

    // إزالة المسافات والرموز من رقم الهاتف
    const number = jid.replace(/[^\d]/g, '')

    if (!number) return null

    return `${number}@s.whatsapp.net`
}

function isDeveloper(sender, settings) {
    const developerSources = [
        settings.owner,
        settings.owners,
        settings.developer,
        settings.developers,
        settings.developerNumber,
        settings.developerNumbers,
        settings.ownerNumber,
        settings.ownerNumbers,

        // دعم بعض البوتات التي تستخدم global
        globalThis.owner,
        globalThis.owners,
        globalThis.developer,
        globalThis.developers
    ]

    const configuredDevelopers = []

    for (const source of developerSources) {
        collectValues(source, configuredDevelopers)
    }

    const senderText = String(sender || '').trim()
    const senderNumber = senderText.split('@')[0].replace(/[^\d]/g, '')

    return configuredDevelopers.some(value => {
        const normalized = normalizeJid(value)

        if (!normalized) return false

        // مطابقة JID كامل مثل 123456789@lid
        if (normalized === senderText) {
            return true
        }

        // مطابقة الرقم فقط عند استخدام @s.whatsapp.net
        const ownerNumber = normalized
            .split('@')[0]
            .replace(/[^\d]/g, '')

        return ownerNumber && ownerNumber === senderNumber
    })
}

function getAllJavaScriptFiles(directory) {
    let files = []

    if (!fs.existsSync(directory)) {
        return files
    }

    const entries = fs.readdirSync(directory, {
        withFileTypes: true
    })

    for (const entry of entries) {
        if (
            entry.name === 'node_modules' ||
            entry.name.startsWith('.')
        ) {
            continue
        }

        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            files.push(...getAllJavaScriptFiles(fullPath))
            continue
        }

        if (
            entry.isFile() &&
            /\.(js|mjs|cjs)$/i.test(entry.name)
        ) {
            files.push(fullPath)
        }
    }

    return files
}

const handler = async (m, { text, command }) => {
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

    const settings = await loadSettings()

    if (!isDeveloper(m.sender, settings)) {
        await m.reply('❌ هذا الأمر مخصص للمطور فقط.')
        return
    }

    if (!text?.includes('|')) {
        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃    𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓
╰━━━━━━━━━━━━━━━━━━━━╯

❌ الصيغة غير صحيحة.

📌 الاستخدام:
.بدل النص_القديم|النص_الجديد

💡 مثال:
.بدل FANITAS|𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓`
        )
        return
    }

    const separatorIndex = text.indexOf('|')

    const oldText = text
        .slice(0, separatorIndex)
        .trim()

    const newText = text
        .slice(separatorIndex + 1)
        .trim()

    if (!oldText || !newText) {
        await m.reply(
            '❌ يجب كتابة النص القديم والجديد بهذا الشكل:\n.بدل القديم|الجديد'
        )
        return
    }

    const pluginsDir = findFileUpward('plugins')

    if (!pluginsDir) {
        await m.reply('❌ لم يتم العثور على مجلد plugins.')
        return
    }

    await m.reply(
        `⏳ جاري البحث عن النص داخل البلوجينات...\n\n` +
        `القديم: ${oldText}\n` +
        `الجديد: ${newText}`
    )

    try {
        const files = getAllJavaScriptFiles(pluginsDir)
        const changedFiles = []

        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8')

                if (!content.includes(oldText)) {
                    continue
                }

                const updatedContent = content.split(oldText).join(newText)

                fs.writeFileSync(
                    filePath,
                    updatedContent,
                    'utf8'
                )

                changedFiles.push(
                    path.relative(pluginsDir, filePath)
                )

                console.log(
                    `✅ تم التعديل في: ${path.relative(pluginsDir, filePath)}`
                )
            } catch (error) {
                console.error(
                    `❌ تعذر تعديل الملف ${filePath}:`,
                    error
                )
            }
        }

        if (changedFiles.length === 0) {
            await m.reply(
                `ℹ️ لم يتم العثور على النص التالي:\n\n${oldText}`
            )
            return
        }

        await m.reply(
`✅ تم الاستبدال بنجاح بواسطة 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓

📁 عدد الملفات المعدلة: ${changedFiles.length}

${changedFiles.map(file => `• ${file}`).join('\n')}

⚠️ قد تحتاج إلى إعادة تشغيل البوت لتطبيق التغييرات.`
        )
    } catch (error) {
        console.error('❌ خطأ أثناء تعديل البلوجينات:', error)

        await m.reply(
            '❌ حدث خطأ أثناء تعديل الملفات:\n' +
            error.message
        )
    }
}

handler.help = [
    'بدل <النص القديم>|<النص الجديد>'
]

handler.tags = [
    'owner',
    'tools'
]

handler.command = /^بدل$/i

// يتوافق مع الهياكل التي تستخدم هذا الخيار
handler.owner = true

handler.desc =
    'استبدال نص داخل جميع ملفات البلوجينات للمطور فقط'

export default handler
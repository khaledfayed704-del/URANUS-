/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓
┃ الوظيفة: استبدال نص خارج plugins
┃ الصلاحية: المطور فقط
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

console.log('✅ بلوجين بدلو FANITAS BOT تم تحميله')

function findFileUpward(filename) {
    let currentDir = __dirname

    for (let i = 0; i < 8; i++) {
        const filePath = path.join(currentDir, filename)

        if (fs.existsSync(filePath)) {
            return filePath
        }

        const parentDir = path.dirname(currentDir)

        if (parentDir === currentDir) {
            break
        }

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

        const settings = await import(
            `${pathToFileURL(settingsPath).href}?update=${Date.now()}`
        )

        return settings.default || settings
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
        const keys = [
            'owner',
            'owners',
            'developer',
            'developers',
            'ownerNumber',
            'ownerNumbers',
            'developerNumber',
            'developerNumbers',
            'number',
            'numbers',
            'id',
            'jid'
        ]

        let foundKnownKey = false

        for (const key of keys) {
            if (value[key]) {
                collectValues(value[key], result)
                foundKnownKey = true
            }
        }

        if (!foundKnownKey) {
            for (const item of Object.values(value)) {
                collectValues(item, result)
            }
        }

        return result
    }

    result.push(String(value))
    return result
}

function normalizeNumber(value) {
    if (!value) return ''

    return String(value)
        .split('@')[0]
        .replace(/[^\d]/g, '')
}

function isDeveloper(sender, settings) {
    const sources = [
        settings.owner,
        settings.owners,
        settings.developer,
        settings.developers,
        settings.ownerNumber,
        settings.ownerNumbers,
        settings.developerNumber,
        settings.developerNumbers,

        globalThis.owner,
        globalThis.owners,
        globalThis.developer,
        globalThis.developers
    ]

    const developers = []

    for (const source of sources) {
        collectValues(source, developers)
    }

    const senderNumber = normalizeNumber(sender)

    if (!senderNumber) {
        return false
    }

    return developers.some(value => {
        return normalizeNumber(value) === senderNumber
    })
}

function getProjectRoot() {
    /*
     * نحدد جذر البوت من مكان package.json.
     * إذا لم يوجد package.json نستخدم المجلد الأعلى الذي يحتوي plugins.
     */

    const packagePath = findFileUpward('package.json')

    if (packagePath) {
        return path.dirname(packagePath)
    }

    const pluginsPath = findFileUpward('plugins')

    if (pluginsPath) {
        return path.dirname(pluginsPath)
    }

    return path.resolve(__dirname, '..', '..')
}

const excludedDirectories = new Set([
    'node_modules',
    '.git',
    '.cache',
    'cache',
    'tmp',
    'temp',
    'sessions',
    'session',
    'auth_info',
    'auth',
    'store',
    'media',
    'logs',
    'backups',
    'dist'
])

const excludedFiles = new Set([
    '.env',
    '.env.local',
    '.env.production',
    'settings.js',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock'
])

const allowedExtensions = new Set([
    '.js',
    '.mjs',
    '.cjs',
    '.json',
    '.ts',
    '.tsx',
    '.jsx',
    '.html',
    '.css',
    '.txt',
    '.md',
    '.yml',
    '.yaml',
    '.xml',
    '.conf',
    '.ini'
])

function isInsidePlugins(filePath, projectRoot) {
    const pluginsPath = path.join(projectRoot, 'plugins')
    const relativePath = path.relative(pluginsPath, filePath)

    return (
        relativePath &&
        !relativePath.startsWith('..') &&
        !path.isAbsolute(relativePath)
    )
}

function getFilesOutsidePlugins(directory, projectRoot) {
    const files = []

    if (!fs.existsSync(directory)) {
        return files
    }

    let entries

    try {
        entries = fs.readdirSync(directory, {
            withFileTypes: true
        })
    } catch (error) {
        console.error(`❌ تعذر قراءة: ${directory}`, error)
        return files
    }

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            if (excludedDirectories.has(entry.name)) {
                continue
            }

            if (entry.name === 'plugins') {
                continue
            }

            files.push(
                ...getFilesOutsidePlugins(fullPath, projectRoot)
            )

            continue
        }

        if (!entry.isFile()) {
            continue
        }

        if (excludedFiles.has(entry.name)) {
            continue
        }

        const extension = path.extname(entry.name).toLowerCase()

        if (!allowedExtensions.has(extension)) {
            continue
        }

        if (isInsidePlugins(fullPath, projectRoot)) {
            continue
        }

        files.push(fullPath)
    }

    return files
}

const handler = async (m, { text, usedPrefix, command }) => {
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
${usedPrefix + command} النص_القديم|النص_الجديد

💡 مثال:
${usedPrefix + command} FANITAS|𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓`
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
            `❌ يجب كتابة الأمر بهذا الشكل:\n` +
            `${usedPrefix + command} القديم|الجديد`
        )
        return
    }

    const projectRoot = getProjectRoot()

    await m.reply(
`⏳ جاري البحث خارج مجلد plugins...

📁 المسار:
${projectRoot}

🔎 النص القديم:
${oldText}

✏️ النص الجديد:
${newText}`
    )

    try {
        const files = getFilesOutsidePlugins(
            projectRoot,
            projectRoot
        )

        const changedFiles = []
        let replacedCount = 0

        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8')

                if (!content.includes(oldText)) {
                    continue
                }

                const matches = content.split(oldText).length - 1
                const updatedContent = content
                    .split(oldText)
                    .join(newText)

                fs.writeFileSync(
                    filePath,
                    updatedContent,
                    'utf8'
                )

                const relativePath = path.relative(
                    projectRoot,
                    filePath
                )

                changedFiles.push(relativePath)
                replacedCount += matches

                console.log(
                    `✅ تم التعديل خارج plugins: ${relativePath}`
                )
            } catch (error) {
                console.error(
                    `❌ تعذر تعديل الملف: ${filePath}`,
                    error
                )
            }
        }

        if (changedFiles.length === 0) {
            await m.reply(
`ℹ️ لم يتم العثور على النص خارج مجلد plugins:

${oldText}`
            )
            return
        }

        await m.reply(
`✅ تم الاستبدال بنجاح

╭━━━━━━━━━━━━━━━━━━━━╮
┃    𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓
╰━━━━━━━━━━━━━━━━━━━━╯

📁 الملفات المعدلة: ${changedFiles.length}
🔁 عدد الاستبدالات: ${replacedCount}

${changedFiles.map(file => `• ${file}`).join('\n')}

⚠️ أعد تشغيل البوت لتطبيق التغييرات بالكامل.`
        )
    } catch (error) {
        console.error('❌ خطأ أثناء تعديل الملفات:', error)

        await m.reply(
            `❌ حدث خطأ أثناء تنفيذ الأمر:\n${error.message}`
        )
    }
}

handler.help = [
    'بدلو <النص القديم>|<النص الجديد>'
]

handler.tags = [
    'owner',
    'tools'
]

handler.command = /^بدلو$/i
handler.owner = true
handler.desc = 'استبدال نص في ملفات المشروع خارج plugins للمطور فقط'

export default handler
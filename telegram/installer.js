// telegram/installer.js
// ✧ تنصيب بوت فرعي عبر تيليجرام (مطابق لأمر .تنصيب في الواتساب) ✧
// ✧ + لوحة مشاهدة البوتات الفرعية (للمالك فقط) ✧

import TelegramBot from 'node-telegram-bot-api'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { gataJadiBot } from '../plugins/تنصيب.js'

// ═══════════════════════════════════════
// ✧ الحالة العامة ✧
// ═══════════════════════════════════════

const waitingForNumber = new Map()   // chatId -> true (بانتظار الرقم)
const waitTimers = new Map()         // chatId -> timer (إلغاء تلقائي)
const loadingMessages = new Map()    // chatId -> message_id (رسالة الانتظار)
const installing = new Set()         // محادثات فيها تنصيب شغال حالياً

const WAIT_TIMEOUT = 2 * 60 * 1000   // إلغاء تلقائي بعد دقيقتين انتظار

let botInstance = null

// ═══════════════════════════════════════
// ✧ المالك + سجل التنصيبات ✧
// ═══════════════════════════════════════

const OWNER_ID = String(global.telegramOwnerID ?? 'ايدي المالك في التيليجرام')
const REGISTRY_FILE = path.join('./URSubBot/', 'registry.json')

if (!global.telegramOwnerID) {
    console.log(chalk.bold.red('⚠️ لم تقم بتحديد global.telegramOwnerID في settings.js — أوامر لوحة تحكم المالك (مسح الجلسات/الداتابيز/ريستارت/إذاعة/نسخة احتياطية) لن تعمل لحد ما تحطه.'))
}

const isOwner = (from) => !!from && !!global.telegramOwnerID && String(from.id) === OWNER_ID

function loadRegistry() {
    try {
        const data = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'))
        return data && typeof data === 'object' ? data : {}
    } catch {
        return {}
    }
}

function saveRegistry(reg) {
    try {
        fs.mkdirSync(path.dirname(REGISTRY_FILE), { recursive: true })
        fs.writeFileSync(REGISTRY_FILE, JSON.stringify(reg, null, 2))
    } catch (e) {
        console.error(chalk.red('❌ فشل حفظ سجل التنصيبات:'), e?.message || e)
    }
}

// ✧ تسجيل منصّب البوت (مين نصّبه من تيليجرام) ✧
function recordInstall(number, installer) {
    const reg = loadRegistry()
    const prev = reg[number] || {}
    reg[number] = {
        tgId: installer.tgId ?? prev.tgId ?? null,
        tgName: installer.tgName ?? prev.tgName ?? null,
        tgUsername: installer.tgUsername ?? prev.tgUsername ?? null,
        installedAt: prev.installedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    saveRegistry(reg)
}

// ═══════════════════════════════════════
// ✧ أدوات مساعدة ✧
// ═══════════════════════════════════════

function extractNumber(input) {
    const cleaned = String(input || '').replace(/\s+/g, '').replace(/^\+/, '')
    const match = cleaned.match(/\d+/)
    return match ? match[0] : ''
}

function parsePhone(number) {
    try {
        const pn = PhoneNumber('+' + number)
        return {
            valid: pn.isValid(),
            international: pn.isValid() ? pn.getNumber('international') : '+' + number,
            region: pn.getRegionCode?.() || null
        }
    } catch {
        return { valid: false, international: '+' + number, region: null }
    }
}

// علم الدولة من كود المنطقة (EG -> 🇪🇬)
function flagOf(region) {
    if (!region || region.length !== 2) return '🌐'
    return String.fromCodePoint(...[...region.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
}

// حماية Markdown من أسماء المستخدمين اللي فيها رموز
const esc = (s) => String(s ?? '').replace(/[_*`\[]/g, '\\$&')

// تنسيق التاريخ المحلي
function fmtDate(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d)) return '—'
    const p = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// ✧ جلب كل البوتات الفرعية من مجلد URSubBot ✧
function getSubBots() {
    const base = './URSubBot/'
    if (!fs.existsSync(base)) return []
    return fs.readdirSync(base)
        .filter(name => /^\d+$/.test(name)) // مجلدات أرقام فقط (يتجاهل registry.json)
        .filter(name => {
            try { return fs.statSync(path.join(base, name)).isDirectory() } catch { return false }
        })
        .map(number => ({
            number,
            connected: fs.existsSync(path.join(base, number, 'creds.json'))
        }))
        .sort((a, b) => Number(a.number) - Number(b.number))
}

// ═══════════════════════════════════════
// ✧ لوحة تحكم المالك: مسح الجلسات / الداتابيز / ريستارت / نسخة احتياطية / إذاعة ✧
// ═══════════════════════════════════════

const waitingForBroadcast = new Map()   // chatId -> true (بانتظار نص الإذاعة)
const broadcastWaitTimers = new Map()   // chatId -> timer
const pendingBroadcast = new Map()      // chatId -> { text }
const broadcastInProgress = new Set()   // محادثات فيها إذاعة شغالة حالياً
const backupInProgress = new Set()      // محادثات فيها نسخ احتياطي شغال حالياً

const rmrf = (p) => {
    try { fs.rmSync(p, { recursive: true, force: true }) } catch {}
}

// ✧ مسح كل جلسات الواتساب: البوت الرئيسي + كل السب بوتات (تيليجرام + واتساب) ✧
function clearAllSessions() {
    const removed = []

    if (global.rutaBot && fs.existsSync(global.rutaBot)) {
        rmrf(global.rutaBot)
        removed.push('الجلسة الرئيسية')
    }

    if (global.rutaJadiBot && fs.existsSync(global.rutaJadiBot)) {
        for (const name of fs.readdirSync(global.rutaJadiBot)) {
            rmrf(path.join(global.rutaJadiBot, name))
        }
        removed.push('السب بوتات (القديمة)')
    }

    const subBase = './URSubBot/'
    if (fs.existsSync(subBase)) {
        let any = false
        for (const name of fs.readdirSync(subBase)) {
            const full = path.join(subBase, name)
            if (/^\d+$/.test(name) && fs.statSync(full).isDirectory()) {
                rmrf(full)
                any = true
            }
        }
        if (any) removed.push('السب بوتات (تيليجرام)')
    }

    return removed
}

// ✧ مسح قاعدة البيانات بالكامل (ذاكرة + قرص) ✧
async function clearDatabaseAll() {
    if (global.db?.wipe) {
        await global.db.wipe()
        return
    }
    // احتياطي: مسح ملفات القرص يدوياً لو الدالة مش متاحة
    const dbDir = './database'
    if (fs.existsSync(dbDir)) {
        for (const f of fs.readdirSync(dbDir)) rmrf(path.join(dbDir, f))
    }
}

// ✧ إنشاء نسخة احتياطية (كود + قاعدة البيانات) بدون جلسات الواتساب لحمايتها ✧
async function makeBackupZip() {
    const zipPath = path.join('./', `backup-${Date.now()}.zip`)
    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath)
        const archive = archiver('zip', { zlib: { level: 9 } })
        output.on('close', resolve)
        archive.on('error', reject)
        archive.pipe(output)
        archive.glob('**/*', {
            cwd: process.cwd(),
            dot: false,
            ignore: [
                'node_modules/**',
                '.git/**',
                'ᏌᏒSession/**',
                'ᏌᏒSubBot/**',
                'URSubBot/**',
                'tmp/**',
                '*.zip'
            ]
        })
        archive.finalize()
    })
    return zipPath
}

// ✧ إذاعة رسالة نصية لكل المستخدمين اللي البوت اتكلم معاهم في الخاص ✧
function getBroadcastTargets() {
    const users = global.db?.data?.users || {}
    return Object.keys(users).filter((jid) => jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid'))
}

async function broadcastToUsers(text, onProgress) {
    const targets = getBroadcastTargets()
    let sent = 0
    let failed = 0
    for (const jid of targets) {
        try {
            await global.conn.sendMessage(jid, { text })
            sent++
        } catch {
            failed++
        }
        if (onProgress && (sent + failed) % 20 === 0) {
            try { await onProgress(sent, failed, targets.length) } catch {}
        }
        await new Promise((res) => setTimeout(res, 1200))
    }
    return { sent, failed, total: targets.length }
}

// ═══════════════════════════════════════
// ✧ تصميم الرسائل ✧
// ═══════════════════════════════════════

const BANNER =
    '✧━━━━━━━━━━━━━━━━✧\n' +
    '       𝑼𝑶𝑹𝑨𝑵𝑶𝑺\n' +
    '✧━━━━━━━━━━━━━━━━✧'

const welcomeText = () =>
    BANNER + '\n\n' +
    '╭─❖ 🤖 *بوت التنصيب*\n' +
    '│\n' +
    '├ 👋 أهلاً فيك!\n' +
    '├ من هنا تقدر تنصّب بوت فرعي\n' +
    '├ على أي رقم واتساب بسهولة\n' +
    '│\n' +
    '╰─────────────────❖\n\n' +
    '👇 *اضغط الزر تحت عشان تبدأ*'

const askNumberText =
    '╭─❖ 📱 *أرسل رقم الواتساب*\n' +
    '│\n' +
    '├ ✍️ اكتب الرقم *مع كود الدولة*\n' +
    '├ ⚠️ بدون + أو مسافات أو رموز\n' +
    '│\n' +
    '├ 📌 *مثال:*\n' +
    '╰─▶ `201012345678`'

const invalidText =
    '╭─❖ ❌ *الرقم غير صحيح*\n' +
    '│\n' +
    '├ 🤔 الرقم اللي بعته مش مظبوط\n' +
    '├ تأكد إنه كامل ومعاه كود الدولة\n' +
    '│\n' +
    '├ 📌 *الشكل الصحيح:*\n' +
    '╰─▶ `201012345678`'

const helpText =
    '╭─❖ ❔ *طريقة التنصيب*\n' +
    '│\n' +
    '├ ❶ اضغط «ابدأ التنصيب»\n' +
    '├ ❷ ابعت رقم الواتساب بكود الدولة\n' +
    '├ ❸ هيوصلك كود الربط هنا\n' +
    '├ ❹ افتح واتساب ← الأجهزة المرتبطة\n' +
    '├ ❺ «ربط برقم الهاتف» وأدخل الكود\n' +
    '│\n' +
    '├ ⏱️ الكود صالح لفترة قصيرة فقط\n' +
    '╰─────────────────❖'

const cancelText =
    '╭─❖ ❌ *تم الإلغاء*\n' +
    '│\n' +
    '├ ما تم تنصيب أي شيء\n' +
    '├ لما تحب جالنا أول بأول 👋\n' +
    '╰─────────────────❖'

const timeoutText =
    '╭─❖ ⌛ *انتهت مدة الانتظار*\n' +
    '│\n' +
    '├ ما بعتش رقم من دقيقتين 🤏\n' +
    '├ ابعت /تنصيب عشان تبدأ من جديد\n' +
    '╰─────────────────❖'

const busyText =
    '⏳ *في عملية تنصيب شغالة حالياً*\nاستنى لحد ما تخلص الأول 🙏'

const loadingText = (info) =>
    '╭─❖ ⏳ *جاري إنشاء كود الربط...*\n' +
    '│\n' +
    `├ 📞 الرقم: ${info.international}\n` +
    `├ 🌍 الدولة: ${flagOf(info.region)} \`${info.region || '؟'}\`\n` +
    '│\n' +
    '├ 🙏 ثواني ويكون جاهز...\n' +
    '╰─────────────────❖'

const codeText = (secret, num) =>
    '╭─❖ 🔑 *كود الربط جاهز!*\n' +
    '│\n' +
    `├ 📞 الرقم: ${num}\n` +
    '│\n' +
    '├ 🔐 *كود الربط:*\n' +
    `╰─▶ \`${secret}\`\n\n` +
    '🎯 *الخطوات:*\n' +
    '❶ افتح واتساب على الرقم\n' +
    '❷ القائمة ⋮ ← الأجهزة المرتبطة\n' +
    '❸ اضغط «ربط برقم الهاتف»\n' +
    '❹ أدخل الكود اللي فوق\n\n' +
    '⏱️ *الكود صالح لفترة قصيرة، أسرع!*'

const successText = (num) =>
    '╭─❖ 🎉 *تم التنصيب بنجاح!*\n' +
    '│\n' +
    '├ ✅ البوت الفرعي اشتغل بنجاح\n' +
    `├ 📞 الرقم: ${num}\n` +
    '│\n' +
    '├ 💡 البوت يرد على الأوامر تلقائياً\n' +
    '╰─────────────────❖'

const errorText =
    '╭─❖ ⚠️ *حصل خطأ!*\n' +
    '│\n' +
    '├ صار خطأ أثناء التنصيب 😔\n' +
    '├ جرّب مرة ثانية بعد شوي\n' +
    '╰─────────────────❖'

const notOwnerText = '⛔ *هذا الأمر مخصص للمالك فقط*'

// ✧ لوحة إدارة النظام ✧
const systemMenuText =
    '╭─❖ ⚙️ *إدارة النظام*\n' +
    '│\n' +
    '├ 🔒 لوحة تحكم خاصة بالمالك فقط\n' +
    '├ اختار العملية اللي عايزها\n' +
    '╰─────────────────❖'

const systemMenuKeyboard = {
    inline_keyboard: [
        [{ text: '🗑️ مسح كل الجلسات', callback_data: 'confirm_clear_sessions' }],
        [{ text: '🧹 مسح قاعدة البيانات', callback_data: 'confirm_clear_db' }],
        [{ text: '🔄 إعادة تشغيل البوت', callback_data: 'confirm_restart' }],
        [{ text: '📦 نسخة احتياطية', callback_data: 'do_backup' }],
        [{ text: '📢 إذاعة رسالة للمستخدمين', callback_data: 'start_broadcast' }],
        [{ text: '🏠 القائمة الرئيسية', callback_data: 'main_menu' }]
    ]
}

const CONFIRM_LABELS = {
    clear_sessions: {
        title: '🗑️ مسح كل الجلسات',
        lines: [
            'هيتفصل البوت الرئيسي وكل السب بوتات',
            'ولازم تعمل ربط (QR / كود) من جديد بعدها'
        ]
    },
    clear_db: {
        title: '🧹 مسح قاعدة البيانات',
        lines: [
            'هيتمسح كل بيانات المستخدمين والمجموعات',
            'والإعدادات المحفوظة نهائياً'
        ]
    },
    restart: {
        title: '🔄 إعادة تشغيل البوت',
        lines: ['هيتقفل البوت دلوقتي ويرجع يشتغل تاني تلقائياً']
    }
}

const confirmText = (action) => {
    const c = CONFIRM_LABELS[action]
    if (!c) return ''
    return (
        '╭─❖ ⚠️ *تأكيد العملية*\n' +
        '│\n' +
        `├ ${c.title}\n` +
        '│\n' +
        c.lines.map((l) => `├ ${l}`).join('\n') + '\n' +
        '│\n' +
        '├ ⚠️ العملية دي *لا يمكن التراجع عنها*\n' +
        '╰─────────────────❖'
    )
}

const confirmKeyboard = (action) => ({
    inline_keyboard: [
        [{ text: '✅ نعم، متأكد', callback_data: `do_${action}` }],
        [{ text: '❌ إلغاء', callback_data: 'system_menu' }]
    ]
})

const systemBackKeyboard = {
    inline_keyboard: [[{ text: '⚙️ إدارة النظام', callback_data: 'system_menu' }]]
}

const askBroadcastText =
    '╭─❖ 📢 *إذاعة رسالة*\n' +
    '│\n' +
    '├ ✍️ ابعت الرسالة اللي عايز تبعتها\n' +
    '├ هتوصل لكل المستخدمين اللي البوت\n' +
    '├ اتكلم معاهم في الخاص\n' +
    '│\n' +
    '├ ⚠️ نص فقط حالياً\n' +
    '╰─────────────────❖'

const broadcastConfirmText = (text, count) =>
    '╭─❖ 📢 *تأكيد الإذاعة*\n' +
    '│\n' +
    `├ 👥 عدد المستقبلين: *${count}*\n` +
    '│\n' +
    '├ 📝 نص الرسالة:\n' +
    `╰─▶ ${text.length > 300 ? text.slice(0, 300) + '…' : text}`

const broadcastConfirmKeyboard = {
    inline_keyboard: [
        [{ text: '✅ ابدأ الإرسال', callback_data: 'confirm_broadcast_send' }],
        [{ text: '❌ إلغاء', callback_data: 'system_menu' }]
    ]
}

// ✧ لوحات الأزرار ✧

// القائمة الرئيسية (زر البوتات يظهر للمالك فقط)
const mainMenuKeyboardFor = (from) => {
    const kb = {
        inline_keyboard: [
            [{ text: '🚀 ابدأ التنصيب', callback_data: 'start_install' }],
            [{ text: '❔ طريقة التنصيب', callback_data: 'help_install' }]
        ]
    }
    if (isOwner(from)) {
        kb.inline_keyboard.push([{ text: '🤖 البوتات الفرعية', callback_data: 'list_bots' }])
        kb.inline_keyboard.push([{ text: '⚙️ إدارة النظام', callback_data: 'system_menu' }])
    }
    return kb
}

const cancelKeyboard = {
    inline_keyboard: [[{ text: '❌ إلغاء', callback_data: 'cancel_install' }]]
}

const backKeyboard = {
    inline_keyboard: [[{ text: '🏠 القائمة الرئيسية', callback_data: 'main_menu' }]]
}

const botsListKeyboard = {
    inline_keyboard: [
        [{ text: '🔄 تحديث', callback_data: 'list_bots' }],
        [{ text: '🏠 القائمة الرئيسية', callback_data: 'main_menu' }]
    ]
}

const retryKeyboard = {
    inline_keyboard: [
        [{ text: '🔁 حاول مرة ثانية', callback_data: 'start_install' }],
        [{ text: '🏠 القائمة الرئيسية', callback_data: 'main_menu' }]
    ]
}

const copyCodeKeyboard = (secret) => ({
    inline_keyboard: [[{ text: '📋 نسخ الكود', copy_text: { text: secret } }]]
})

const successKeyboardFor = (from) => {
    const kb = {
        inline_keyboard: [
            [{ text: '➕ تنصيب رقم تاني', callback_data: 'start_install' }],
            [{ text: '🏠 القائمة الرئيسية', callback_data: 'main_menu' }]
        ]
    }
    if (isOwner(from)) {
        kb.inline_keyboard.splice(1, 0, [{ text: '🤖 البوتات الفرعية', callback_data: 'list_bots' }])
        kb.inline_keyboard.splice(2, 0, [{ text: '⚙️ إدارة النظام', callback_data: 'system_menu' }])
    }
    return kb
}

// ═══════════════════════════════════════
// ✧ التشغيل ✧
// ═══════════════════════════════════════

export function startTelegramInstaller() {
    if (!global.telegramInstallerEnabled) {
        console.log(chalk.yellow('⚠️ نظام التنصيب عبر تيليجرام معطل (telegramInstallerEnabled = false)'))
        return null
    }

    const token = global.telegramInstallerToken
    if (!token) {
        console.log(chalk.yellow('⚠️ لا يوجد توكن تيليجرام (global.telegramInstallerToken)، لن يتم تشغيل بوت التنصيب'))
        return null
    }

    let bot
    try {
        bot = new TelegramBot(token, { polling: true })
    } catch (e) {
        console.error(chalk.red('❌ فشل تشغيل بوت تيليجرام:'), e)
        return null
    }
    botInstance = bot

    bot.on('polling_error', (err) => {
        console.error(chalk.red('❌ Telegram polling error:'), err?.message || err)
    })

    bot.getMe()
        .then(me => console.log(chalk.bold.greenBright(`✅ بوت تيليجرام للتنصيب يعمل الآن (@${me.username})`)))
        .catch(() => console.log(chalk.bold.greenBright('✅ بوت تيليجرام للتنصيب يعمل الآن')))

    // ✧ تنظيف حالة الانتظار ✧
    const clearWait = (chatId) => {
        const t = waitTimers.get(chatId)
        if (t) clearTimeout(t)
        waitTimers.delete(chatId)
        waitingForNumber.delete(chatId)
    }

    // ✧ تعديل رسالة بأمان (يتجاهل خطأ "message is not modified") ✧
    const editSafe = async (chatId, msgId, text, opts) => {
        try {
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, ...opts })
            return true
        } catch (e) {
            if (String(e?.message || '').includes('message is not modified')) return true
            return false
        }
    }

    // ✧ القائمة الرئيسية ✧
    const sendWelcome = (chatId, from) =>
        bot.sendMessage(chatId, welcomeText(), {
            parse_mode: 'Markdown',
            reply_markup: mainMenuKeyboardFor(from)
        })

    // ✧ طلب الرقم ✧
    const askForNumber = async (chatId) => {
        clearWait(chatId)
        waitingForNumber.set(chatId, true)
        waitTimers.set(chatId, setTimeout(async () => {
            if (waitingForNumber.delete(chatId)) {
                waitTimers.delete(chatId)
                await bot.sendMessage(chatId, timeoutText, { parse_mode: 'Markdown' }).catch(() => {})
            }
        }, WAIT_TIMEOUT))
        await bot.sendMessage(chatId, askNumberText, { parse_mode: 'Markdown', reply_markup: cancelKeyboard })
    }

    // ═══════════════════════════════════
    // ✧ لوحة البوتات الفرعية (للمالك فقط) ✧
    // ═══════════════════════════════════
    const sendBotsList = async (chatId, msgId = null) => {
        const subBots = getSubBots()
        const reg = loadRegistry()

        let header
        let entries = []

        if (!subBots.length) {
            header =
                '╭─❖ 📭 *لا توجد بوتات فرعية*\n' +
                '│\n' +
                '├ لسه مفيش أي بوت منصّب\n' +
                '╰─────────────────❖'
        } else {
            const connected = subBots.filter(b => b.connected).length
            header =
                '╭─❖ 🤖 *البوتات الفرعية المنصبة*\n' +
                `├ 📊 الإجمالي: *${subBots.length}* بوت\n` +
                `├ 🟢 متصل: *${connected}*  •  🔴 غير متصل: *${subBots.length - connected}*\n` +
                '╰─────────────────❖\n\n'

            entries = subBots.map((b, i) => {
                const info = parsePhone(b.number)
                const r = reg[b.number] || {}
                const name = r.tgName ? esc(r.tgName) : 'غير معروف'
                const user = r.tgUsername ? ` (@${esc(r.tgUsername)})` : ''
                const status = b.connected ? '🟢' : '🔴'
                return (
                    `┏ ${status} *${i + 1}.* 📞 ${info.international}\n` +
                    `┃ 👤 ${name}${user}\n` +
                    `┃ 🆔 \`${r.tgId || '—'}\`\n` +
                    `┃ 📅 ${fmtDate(r.updatedAt || r.installedAt)}\n` +
                    `┗ ─────────────────`
                )
            })
        }

        // تقسيم القائمة لو كتير (حد تيليجرام 4096 حرف)
        const perMessage = 10
        const chunks = []
        for (let i = 0; i < entries.length; i += perMessage) {
            chunks.push(entries.slice(i, i + perMessage).join('\n'))
        }
        if (!chunks.length) chunks.push('')

        const firstText = header + chunks[0]
        const opts = { parse_mode: 'Markdown', reply_markup: botsListKeyboard }

        if (msgId) {
            const ok = await editSafe(chatId, msgId, firstText, opts)
            if (!ok) await bot.sendMessage(chatId, firstText, opts).catch(() => {})
        } else {
            await bot.sendMessage(chatId, firstText, opts).catch(() => {})
        }
        for (let c = 1; c < chunks.length; c++) {
            await bot.sendMessage(chatId, chunks[c], { parse_mode: 'Markdown' }).catch(() => {})
        }
    }

    // ✧ الأوامر ✧
    bot.onText(/^\/start(@\w+)?/i, (msg) => sendWelcome(msg.chat.id, msg.from))

    bot.onText(/^\/help(@\w+)?/i, (msg) =>
        bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown', reply_markup: backKeyboard })
    )

    bot.onText(/^\/cancel(@\w+)?/i, (msg) => {
        clearWait(msg.chat.id)
        bot.sendMessage(msg.chat.id, cancelText, { parse_mode: 'Markdown', reply_markup: backKeyboard })
    })

    bot.onText(/^\/(تنصيب|install)(@\w+)?/i, (msg) => askForNumber(msg.chat.id))

    // ✧ أمر عرض البوتات الفرعية (للمالك فقط) ✧
    bot.onText(/^\/(bots|subbots|بوتات|البوتات|بوتاتي|الفرعية)(@\w+)?$/i, async (msg) => {
        const chatId = msg.chat.id
        if (!isOwner(msg.from)) {
            return bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
        }
        await bot.sendChatAction(chatId, 'typing').catch(() => {})
        await sendBotsList(chatId)
    })

    // ✧ أمر لوحة إدارة النظام (للمالك فقط) ✧
    bot.onText(/^\/(system|النظام|الادارة|الإدارة)(@\w+)?$/i, async (msg) => {
        const chatId = msg.chat.id
        if (!isOwner(msg.from)) {
            return bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
        }
        await bot.sendMessage(chatId, systemMenuText, { parse_mode: 'Markdown', reply_markup: systemMenuKeyboard }).catch(() => {})
    })

    // ✧ ضغطات الأزرار ✧
    bot.on('callback_query', async (query) => {
        const chatId = query.message?.chat?.id
        if (!chatId) return
        const msgId = query.message?.message_id

        switch (query.data) {
            case 'start_install':
                if (installing.has(chatId)) {
                    await bot.sendMessage(chatId, busyText, { parse_mode: 'Markdown' }).catch(() => {})
                } else {
                    await askForNumber(chatId)
                }
                break

            case 'help_install':
                await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown', reply_markup: backKeyboard }).catch(() => {})
                break

            case 'main_menu':
                if (msgId) {
                    const ok = await editSafe(chatId, msgId, welcomeText(), {
                        parse_mode: 'Markdown',
                        reply_markup: mainMenuKeyboardFor(query.from)
                    })
                    if (!ok) sendWelcome(chatId, query.from)
                } else {
                    sendWelcome(chatId, query.from)
                }
                break

            case 'list_bots':
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                } else {
                    await sendBotsList(chatId, msgId)
                }
                break

            case 'cancel_install':
                clearWait(chatId)
                if (msgId) {
                    const ok = await editSafe(chatId, msgId, cancelText, {
                        parse_mode: 'Markdown', reply_markup: backKeyboard
                    })
                    if (!ok) {
                        await bot.sendMessage(chatId, cancelText, { parse_mode: 'Markdown', reply_markup: backKeyboard }).catch(() => {})
                    }
                }
                break

            // ═══ لوحة إدارة النظام (للمالك فقط) ═══
            case 'system_menu':
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                } else if (msgId) {
                    const ok = await editSafe(chatId, msgId, systemMenuText, { parse_mode: 'Markdown', reply_markup: systemMenuKeyboard })
                    if (!ok) await bot.sendMessage(chatId, systemMenuText, { parse_mode: 'Markdown', reply_markup: systemMenuKeyboard }).catch(() => {})
                } else {
                    await bot.sendMessage(chatId, systemMenuText, { parse_mode: 'Markdown', reply_markup: systemMenuKeyboard }).catch(() => {})
                }
                break

            case 'confirm_clear_sessions':
            case 'confirm_clear_db':
            case 'confirm_restart': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                const action = query.data.replace('confirm_', '')
                const ok = msgId ? await editSafe(chatId, msgId, confirmText(action), { parse_mode: 'Markdown', reply_markup: confirmKeyboard(action) }) : false
                if (!ok) await bot.sendMessage(chatId, confirmText(action), { parse_mode: 'Markdown', reply_markup: confirmKeyboard(action) }).catch(() => {})
                break
            }

            case 'do_clear_sessions': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                await bot.sendChatAction(chatId, 'typing').catch(() => {})
                const removed = clearAllSessions()
                await bot.sendMessage(
                    chatId,
                    '╭─❖ ✅ *تم مسح الجلسات*\n│\n' +
                    (removed.length ? removed.map((r) => `├ 🗑️ ${r}`).join('\n') : '├ محدش لقيت أي جلسة') +
                    '\n│\n├ ⚠️ لازم دلوقتي تعمل ريستارت وتربط تاني\n╰─────────────────❖',
                    { parse_mode: 'Markdown', reply_markup: systemBackKeyboard }
                ).catch(() => {})
                break
            }

            case 'do_clear_db': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                await bot.sendChatAction(chatId, 'typing').catch(() => {})
                try {
                    await clearDatabaseAll()
                    await bot.sendMessage(chatId, '✅ *تم مسح قاعدة البيانات بالكامل*', { parse_mode: 'Markdown', reply_markup: systemBackKeyboard }).catch(() => {})
                } catch (e) {
                    await bot.sendMessage(chatId, '❌ فشل مسح قاعدة البيانات: ' + (e?.message || e), { reply_markup: systemBackKeyboard }).catch(() => {})
                }
                break
            }

            case 'do_restart': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                await bot.sendMessage(chatId, '🔄 *جاري إعادة تشغيل البوت...*', { parse_mode: 'Markdown' }).catch(() => {})
                setTimeout(() => process.exit(1), 1500)
                break
            }

            case 'do_backup': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                if (backupInProgress.has(chatId)) {
                    await bot.sendMessage(chatId, '⏳ في نسخة احتياطية شغالة بالفعل، استنى تخلص').catch(() => {})
                    break
                }
                backupInProgress.add(chatId)
                await bot.sendMessage(chatId, '📦 *جاري تجهيز النسخة الاحتياطية...*', { parse_mode: 'Markdown' }).catch(() => {})
                let zipPath = null
                try {
                    zipPath = await makeBackupZip()
                    const size = fs.statSync(zipPath).size
                    const sizeMB = (size / 1024 / 1024).toFixed(2)
                    if (size > 49 * 1024 * 1024) {
                        await bot.sendMessage(chatId, `⚠️ حجم النسخة *${sizeMB}MB* أكبر من حد تيليجرام (50MB) ومقدرش أبعتها هنا`, { parse_mode: 'Markdown', reply_markup: systemBackKeyboard }).catch(() => {})
                    } else {
                        await bot.sendDocument(chatId, zipPath, {
                            caption: `📦 نسخة احتياطية (كود + قاعدة بيانات، بدون جلسات الواتساب)\n🗓️ ${fmtDate(new Date().toISOString())}\n📁 ${sizeMB}MB`
                        })
                    }
                } catch (e) {
                    console.error(chalk.red('❌ Backup error:'), e)
                    await bot.sendMessage(chatId, '❌ فشل إنشاء النسخة الاحتياطية: ' + (e?.message || e), { reply_markup: systemBackKeyboard }).catch(() => {})
                } finally {
                    backupInProgress.delete(chatId)
                    if (zipPath) fs.unlink(zipPath, () => {})
                }
                break
            }

            case 'start_broadcast': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                const t = broadcastWaitTimers.get(chatId)
                if (t) clearTimeout(t)
                waitingForBroadcast.set(chatId, true)
                broadcastWaitTimers.set(chatId, setTimeout(() => {
                    waitingForBroadcast.delete(chatId)
                    broadcastWaitTimers.delete(chatId)
                }, WAIT_TIMEOUT))
                await bot.sendMessage(chatId, askBroadcastText, { parse_mode: 'Markdown', reply_markup: cancelKeyboard }).catch(() => {})
                break
            }

            case 'confirm_broadcast_send': {
                if (!isOwner(query.from)) {
                    await bot.sendMessage(chatId, notOwnerText, { parse_mode: 'Markdown' }).catch(() => {})
                    break
                }
                const pending = pendingBroadcast.get(chatId)
                if (!pending) {
                    await bot.sendMessage(chatId, '⚠️ مفيش رسالة محفوظة، ابدأ الإذاعة من جديد', { reply_markup: systemBackKeyboard }).catch(() => {})
                    break
                }
                pendingBroadcast.delete(chatId)
                if (broadcastInProgress.has(chatId)) break
                broadcastInProgress.add(chatId)
                const progressMsg = await bot.sendMessage(chatId, '📢 *جاري الإرسال...*', { parse_mode: 'Markdown' }).catch(() => null)
                broadcastToUsers(pending.text, async (sent, failed, total) => {
                    if (progressMsg) await editSafe(chatId, progressMsg.message_id, `📢 *جاري الإرسال...* ${sent + failed}/${total}`, { parse_mode: 'Markdown' })
                }).then(async (result) => {
                    broadcastInProgress.delete(chatId)
                    await bot.sendMessage(
                        chatId,
                        '╭─❖ ✅ *تمت الإذاعة*\n│\n' +
                        `├ 📤 تم الإرسال: *${result.sent}*\n` +
                        `├ ❌ فشل: *${result.failed}*\n` +
                        `├ 👥 الإجمالي: *${result.total}*\n` +
                        '╰─────────────────❖',
                        { parse_mode: 'Markdown', reply_markup: systemBackKeyboard }
                    ).catch(() => {})
                }).catch(async (e) => {
                    broadcastInProgress.delete(chatId)
                    await bot.sendMessage(chatId, '❌ حصل خطأ أثناء الإذاعة: ' + (e?.message || e), { reply_markup: systemBackKeyboard }).catch(() => {})
                })
                break
            }
        }

        bot.answerCallbackQuery(query.id).catch(() => {})
    })

    // ✧ الرسائل العادية ✧
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const text = (msg.text || '').trim()

        // تجاهل الأوامر (اتعالجت فوق)
        if (text.startsWith('/')) return

        const isWaiting = !!waitingForNumber.get(chatId)
        const isWaitingBroadcast = !!waitingForBroadcast.get(chatId)

        // إلغاء بالكتابة
        if ((isWaiting || isWaitingBroadcast) && /^(الغاء|إلغاء|cancel|ايقاف|إيقاف|وقف)$/i.test(text)) {
            clearWait(chatId)
            const bt = broadcastWaitTimers.get(chatId)
            if (bt) clearTimeout(bt)
            waitingForBroadcast.delete(chatId)
            broadcastWaitTimers.delete(chatId)
            return bot.sendMessage(chatId, cancelText, { parse_mode: 'Markdown', reply_markup: backKeyboard })
        }

        // ✧ استلام نص الإذاعة (للمالك فقط) ✧
        if (isWaitingBroadcast && isOwner(msg.from)) {
            const bt = broadcastWaitTimers.get(chatId)
            if (bt) clearTimeout(bt)
            waitingForBroadcast.delete(chatId)
            broadcastWaitTimers.delete(chatId)

            if (!text) {
                return bot.sendMessage(chatId, '📢 ابعت *نص* الرسالة فقط 😅', { parse_mode: 'Markdown' })
            }

            const count = getBroadcastTargets().length
            pendingBroadcast.set(chatId, { text })
            return bot.sendMessage(chatId, broadcastConfirmText(text, count), { parse_mode: 'Markdown', reply_markup: broadcastConfirmKeyboard })
        }

        // لو في تنصيب شغال حالياً
        if (installing.has(chatId)) {
            clearWait(chatId)
            return bot.sendMessage(chatId, busyText, { parse_mode: 'Markdown' })
        }

        if (!isWaiting) return

        // رسائل غير نصية
        if (!text) {
            return bot.sendMessage(chatId, '📱 ابعت *الرقم كنص فقط*، مش صورة أو ملف 😅', { parse_mode: 'Markdown' })
        }

        const number = extractNumber(text)
        const info = parsePhone(number)

        if (!info.valid) {
            return bot.sendMessage(chatId, invalidText, { parse_mode: 'Markdown', reply_markup: retryKeyboard })
        }

        clearWait(chatId)
        installing.add(chatId)
        // أمان: فضّ الحالة بعد 5 دقايق لو حصل تعليق
        setTimeout(() => installing.delete(chatId), 5 * 60 * 1000)

        await bot.sendChatAction(chatId, 'typing').catch(() => {})

        const loadingMsg = await bot.sendMessage(chatId, loadingText(info), { parse_mode: 'Markdown' })
        loadingMessages.set(chatId, loadingMsg.message_id)

        const pathGataJadiBot = path.join('./URSubBot/', number)
        if (!fs.existsSync(pathGataJadiBot)) {
            fs.mkdirSync(pathGataJadiBot, { recursive: true })
        }

        // بيانات مَن بيتصّب (من تيليجرام)
        const installerInfo = {
            tgId: msg.from?.id ?? null,
            tgName: [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') || null,
            tgUsername: msg.from?.username || null
        }

        try {
            await gataJadiBot({
                pathGataJadiBot,
                m: null,
                conn: global.conn,
                args: [number],
                usedPrefix: '.',
                command: 'تنصيب',
                fromCommand: true,
                notify: {
                    // ✧ لما الكود يجهز ✧
                    onCode: async (secret, num) => {
                        // سجّل مين طلب التنصيب
                        recordInstall(number, installerInfo)

                        const body = codeText(secret, info.international || '+' + (num || number))
                        const oldMsgId = loadingMessages.get(chatId)
                        loadingMessages.delete(chatId)

                        const opts = { parse_mode: 'Markdown', reply_markup: copyCodeKeyboard(secret) }
                        if (oldMsgId) {
                            const edited = await editSafe(chatId, oldMsgId, body, opts)
                            if (edited) return
                        }
                        await bot.sendMessage(chatId, body, opts)
                    },
                    // ✧ لما الربط ينجح ✧
                    onConnected: async (num) => {
                        installing.delete(chatId)

                        // حدّث السجل (آخر تحديث)
                        recordInstall(number, installerInfo)

                        const oldMsgId = loadingMessages.get(chatId)
                        if (oldMsgId) {
                            loadingMessages.delete(chatId)
                            bot.deleteMessage(chatId, oldMsgId).catch(() => {})
                        }

                        await bot.sendMessage(chatId, successText(info.international || '+' + (num || number)), {
                            parse_mode: 'Markdown',
                            reply_markup: successKeyboardFor(msg.from)
                        })
                    }
                }
            }, number)
        } catch (e) {
            console.error(chalk.red('❌ Telegram install error:'), e)
            installing.delete(chatId)
            loadingMessages.delete(chatId)
            bot.sendMessage(chatId, errorText, { parse_mode: 'Markdown', reply_markup: retryKeyboard })
        }
    })

    return bot
}

// ✧ إيقاف البوت (لو احتجته) ✧
export function stopTelegramInstaller() {
    if (!botInstance) return
    try {
        botInstance.stopPolling()
        botInstance.close?.()
    } catch {}
    botInstance = null
    waitingForNumber.clear()
    waitTimers.forEach(t => clearTimeout(t))
    waitTimers.clear()
    loadingMessages.clear()
    installing.clear()
    waitingForBroadcast.clear()
    broadcastWaitTimers.forEach((t) => clearTimeout(t))
    broadcastWaitTimers.clear()
    pendingBroadcast.clear()
    broadcastInProgress.clear()
    backupInProgress.clear()
    console.log(chalk.yellow('🛑 تم إيقاف بوت تيليجرام للتنصيب'))
}
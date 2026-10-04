import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import ws from 'ws'
import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// الصورة الثابتة - تم تغييرها للرابط الجديد
const YORU_IMAGE = 'https://file.garden/aauvg01sjleV_ic1/nier%20automata%20by%20GoddessMechanic.jpg'

async function handler(m, { conn }) {

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // مسار الجلسات
  const carpetaBase = path.resolve(__dirname, '..', 'MB-ᏌᏒSubBot')
  let cantidadCarpetas = 0

  try {
    cantidadCarpetas = fs.readdirSync(carpetaBase, { withFileTypes: true })
      .filter(dir => dir.isDirectory()).length
  } catch {}

  // وقت تشغيل السيرفر
  const uptime = convertirMs(process.uptime() * 1000)

  // تأمين conns
  const conns = Array.isArray(global.conns) ? global.conns : []

  const users = conns.filter(
    c =>
      c?.user &&
      c?.ws?.socket &&
      c.ws.socket.readyState !== ws.CLOSED
  )

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌸 الزخرفة الجديدة لقائمة البوتات باستخدام theme
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const message = users.map((v, index) => {

    const userDB = global.db?.data?.users?.[v.user.jid] || {}
    const hidden = userDB.privacy === true

    const botNumber = hidden
      ? '[ مـخـفـي بـسـبـب الـخـصـوصـيـة ]'
      : `wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=.تنصيب`

    const prestarStatus =
      !hidden && userDB.prestar
        ? '✅ يـمـكـن اسـتـعـارة الـبـوت لإدخاله جروبات'
        : ''

    return `${theme.darkStar} 🌸
${theme.target}┊≡ الـرقـم: [${index + 1}]
${theme.sword}┊≡ الاسـم: ${v.user.name || userDB.name || 'مجهول'}
${theme.eye}┊ الـتـشـغـيـل: \`\`\`${v.uptime ? convertirMs(Date.now() - v.uptime) : 'غير معروف'}\`\`\`
${theme.smallDivider}
┃
┃ 💠 الـرابـط: ${botNumber}
┃ ${prestarStatus}
┃
${theme.endDivider}`
  }).join('\n\n')

  const replyMessage = message.length
    ? message
    : `${theme.darkStar} 🌸
${theme.target}┊≡ ❌ لا يـوجـد سـب بـوت مـتـصـل حـالـيـاً
${theme.sword}┊≡ جـرب لاحـقـاً
${theme.eye}┊ wa.me/${conn.user.jid.replace(/[^0-9]/g, '')}?text=.تنصيب
${theme.smallDivider}
┃
┃ 💠 يمكنك إنشاء سب بوت خاص بك
┃
${theme.endDivider}`

  const responseMessage = `
${theme.darkStar} 🌸
${theme.target}┊≡ قـائـمـة الــبـوتـات الـفـرعـيـة
${theme.sword}┊≡ مـمـيـزات إتـصـال تـلـقـائـي
${theme.smallDivider}
┃
┃ ↜ إنـشـاء سـب بـوت مـن أي سـب بـوت
┃
${theme.smallDivider}

*⧉┆📊 الإحـصـائـيـات*
*⧉┆↜ البـوتـات الـمـتـصـلـة:* ${users.length}
*⧉┆↜ الـجـلـسـات الـمـنـشـأة:* ${cantidadCarpetas}
*⧉┆↜ الـجـلـسـات الـنـشـطـة:* ${users.length}
*⧉┆💻 الـسـيـرفـر:* \`\`\`${uptime}\`\`\`

${replyMessage}
`.trim()

  try {
    await conn.sendMessage(
      m.chat,
      {
        image: { url: YORU_IMAGE },
        caption: responseMessage
      },
      { quoted: m }
    )
  } catch {
    await conn.sendMessage(m.chat, { text: responseMessage }, { quoted: m })
  }
}

handler.command = /^(قائمة_البوتات|البوتات|بوتات|bots|سب_بوتات)$/i
export default handler

function convertirMs(ms) {
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000) % 60
  const h = Math.floor(ms / 3600000) % 24
  const d = Math.floor(ms / 86400000)
  return [d ? `${d}d` : '', `${h}h`, `${m}m`, `${s}s`]
    .filter(Boolean)
    .join(' ')
}

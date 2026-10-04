import { proto, generateWAMessageFromContent, jidNormalizedUser } from '@whiskeysockets/baileys'
import axios from 'axios'


// ══════════════════════════════════════════════════════════════
// 🛒 عربة التسوق: رسالة order بصورة مصغرة وعنوان (شكل مميز في الشات)
// ══════════════════════════════════════════════════════════════
export async function sendCart(conn, m, opts = {}) {
  const {
    thumbnail,
    title = '',
    message = '',
    orderId = 'CART-001',
    sellerJid,
    itemCount = 1,
  } = opts


  const chatJid = m.chat || m.key.remoteJid


  try {
    let thumb
    if (Buffer.isBuffer(thumbnail)) thumb = thumbnail.toString('base64')
    else if (typeof thumbnail === 'string' && /^https?:\/\//.test(thumbnail)) {
      try {
        const res = await axios.get(thumbnail, { responseType: 'arraybuffer', timeout: 10000 })
        thumb = Buffer.from(res.data).toString('base64')
      } catch {} // بدون صورة أحسن من ما تفشل الرسالة
    }


    const botJid = jidNormalizedUser(conn.user?.id || conn.user?.jid || '')


    const webMsg = proto.Message.fromObject({
      orderMessage: {
        orderId: String(orderId),
        thumbnail: thumb,
        itemCount,
        status: 1,
        surface: 1,
        message,
        orderTitle: title,
        sellerJid: sellerJid || botJid,
        token: '1',
        messageVersion: 1,
      },
    })


    const waMsg = generateWAMessageFromContent(chatJid, webMsg, {
      userJid: conn.user?.id || conn.user?.jid,
      quoted: m,
    })


    await conn.relayMessage(chatJid, waMsg.message, { messageId: waMsg.key.id })
    return waMsg
  } catch (e) {
    console.error('[cart] فشل، رجوع للنص العادي:', e.message)
    return conn.sendMessage(chatJid, { text: message }, { quoted: m })
  }
}


// ══════════════════════════════════════════════════════════════
// 🚫 رسائل رفض الصلاحيات (ستايل "القارئ")
// ══════════════════════════════════════════════════════════════
const DFAIL_THUMB = 'https://files.catbox.moe/vbubex.jpg'


export const dfailMessages = {
  rowner  : '✦ *القارئ:* "أنا لا أستجيب إلا لأوامر أقدم تجسيد... قائد السديم."',
  owner   : '✦ *القارئ:* "هذا السيناريو مقيد... فقط قائد السديم يمكنه استدعاءه."',
  mods    : '✦ *القارئ:* "هذا المستوى من Powers محجوز... للقادة وحدهم."',
  premium : '✦ *القارئ:* "هذه المهارة تتطلب عقد الراعي الأعلى (Premium)."',
  group   : '✦ *القارئ:* "هذا السيناريو لا يُفتح إلا داخل ساحة التحالفات (المجموعات)."',
  private : '✦ *القارئ:* "هذا السيناريو مخصص لقناة التجسيد الخاصة فقط."',
  admin   : '✦ *القارئ:* "فقط حاملي ألقاب النقابة (المشرفين) يمكنهم تفعيل هذا السيناريو."',
  botAdmin: '✦ *القارئ:* "لم تمنحني لقب المشرف بعد... امنحني الصلاحيات لأحمي السيناريو."',
  restrict: '✦ *القارئ:* "هذا السيناريو معطل حالياً... خلل في طاقة الاحتمالية."',
  unreg   : '✦ *القارئ:* "لم يُسجَّل عقلك بعد... أكمل المراسلة أولاً."',
}


// الرفض بشكل "سلعة" (عربة تسوق بصورة مصغرة وعنوان) — نفس بوت الأرشيف بالظبط.
// لو عايزه صورة عادية بكابشن: global.dfailStyle = 'image' في config.js
export async function dfail(type, m, conn) {
  const message = dfailMessages[type]
  if (!message) return


  if (global.dfailStyle === 'image') {
    const chatJid = m.chat || m.key.remoteJid
    try {
      const res = await axios.get(DFAIL_THUMB, { responseType: 'arraybuffer', timeout: 10000 })
      return await conn.sendMessage(chatJid, {
        image: Buffer.from(res.data),
        caption: `${message}\n\n> ✦ 𝐊𝐋𝐈𝐍𝐄 | القارئ ✦`,
      }, { quoted: m })
    } catch (e) {
      console.error('[dfail] فشل إرسال الصورة، رجوع للسلعة:', e.message)
    }
  }


  return sendCart(conn, m, {
    thumbnail: DFAIL_THUMB,
    title: '✦ القارئ ✦',
    message,
    orderId: 'READER-ERROR',
  })
}


// أول شرط صلاحية مش متحقق (أو null لو كله تمام)
export function getDeniedAccessType(plugin, ctx) {
  if (plugin.restrict)                                  return 'restrict'
  if (plugin.rowner   && !ctx.isOwner)                  return 'rowner'
  if (plugin.owner    && !ctx.isOwner)                  return 'owner'
  if (plugin.premium  && !ctx.isElite)                  return 'premium'
  if (plugin.group    && !ctx.isGroup)                  return 'group'
  if (plugin.private  && ctx.isGroup)                   return 'private'
  if (plugin.admin    && ctx.isGroup && !ctx.isAdmin)   return 'admin'
  if (plugin.botAdmin && ctx.isGroup && !ctx.isBotAdmin) return 'botAdmin'
  return null
}
// plugins/edit.js
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import axios from 'axios'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const API_BASE = 'https://engez.a7a.online/api/v1'
const PINTEREST_ENDPOINT = `${API_BASE}/search/pinterest`
const FOOTER = '◜⏤͟͟͞͞ 𝐄𝐃𝐈𝐓 𝐁𝐎𝐓 ◞•'
const MAX_CARDS = 5
const MAX_TRIED = 15
const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'

// تخزين نتائج البحث لاختيار المستخدم
const pendingEdits = new Map()

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

async function searchPins(query) {
  const apiUrl = `${PINTEREST_ENDPOINT}?action=${encodeURIComponent('بحث')}&q=${encodeURIComponent(query)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('فشل البحث في Pinterest')
  }

  const results = data.response?.results
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('لا توجد نتائج فيديو لهذا البحث')
  }

  return results
}

async function resolveDownloadUrl(pin) {
  const params = new URLSearchParams({
    action: 'تحميل',
    pinUrl: pin.pin_url
  })
  if (pin.video_url) params.set('videoUrl', pin.video_url)
  if (pin.hls_url) params.set('hlsUrl', pin.hls_url)
  if (pin.video_signature) params.set('videoSignature', pin.video_signature)

  const apiUrl = `${PINTEREST_ENDPOINT}?${params.toString()}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true || !data.response?.downloadUrl) {
    throw new Error(data?.error || 'فشل الحصول على رابط التحميل المباشر')
  }

  return data.response.downloadUrl
}

async function downloadVideoBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { 'user-agent': UA },
    timeout: 60000,
    maxRedirects: 5
  })
  return Buffer.from(res.data)
}

// ─── الأمر الأساسي: البحث وعرض Carousel ───
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

  if (!text) {
    return m.reply(`${FOOTER}\n\n📌 *مثال الاستخدام:*\n${usedPrefix + command} ناروتو`)
  }

  // إضافة كلمة edit لزيادة الدقة
  const searchQuery = `${text} edit`

  await m.react('🔍')

  let pins
  try {
    pins = await searchPins(searchQuery)
  } catch (e) {
    await m.react('❌')
    return m.reply(`❌ ${e.message}`)
  }

  shuffleArray(pins)

  const cards = []
  const validPins = []
  let tried = 0

  for (let i = 0; i < pins.length && cards.length < MAX_CARDS; i++) {
    if (tried >= MAX_TRIED) break
    tried++
    const pin = pins[i]
    try {
      const downloadUrl = await resolveDownloadUrl(pin)
      const videoBuffer = await downloadVideoBuffer(downloadUrl)
      if (!videoBuffer || videoBuffer.length < 50000) continue

      const { videoMessage } = await prepareWAMessageMedia(
        { video: videoBuffer },
        { upload: conn.waUploadToServer }
      )

      const sizeText = formatSize(videoBuffer.length)
      const title = (pin.title || 'ايديت').slice(0, 80)

      validPins.push({ pin, videoBuffer, title })

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: title }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `📦 ${sizeText} | ${FOOTER}` }),
        header: {
          title,
          hasMediaAttachment: true,
          videoMessage
        },
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'تحميل 🎬',
              id: `edit_${cards.length}`
            })
          }]
        })
      })
    } catch (e) {
      console.error(`[edit-carousel] خطأ في معالجة Pin ${i}:`, e.message)
    }
  }

  if (cards.length === 0) {
    await m.react('❌')
    return conn.reply(m.chat, '❌ لم أتمكن من تحميل أي إيديتات، جرب شخصية أخرى.', m)
  }

  // حفظ النتائج للاختيار
  pendingEdits.set(m.sender, {
    pins: validPins,
    timestamp: Date.now()
  })

  const msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: {
            body: proto.Message.InteractiveMessage.Body.create({
              text: `🎬 *إيديتات ${text}*`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: `📊 ${cards.length} نتائج | اختر للتحميل`
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
          }
        }
      }
    },
    { quoted: m }
  )

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await m.react('✅')
}

// ─── معالجة اختيار البطاقة وتحميل الفيديو ───
handler.before = async (m, { conn }) => {
  if (m.message?.buttonsResponseMessage) {
    const selectedId = m.message.buttonsResponseMessage.selectedButtonId
    if (!selectedId || !selectedId.startsWith('edit_')) return false

    const index = parseInt(selectedId.replace('edit_', ''))
    const data = pendingEdits.get(m.sender)
    
    if (!data || Date.now() - data.timestamp > 600000) {
      pendingEdits.delete(m.sender)
      return false
    }

    const item = data.pins[index]
    if (!item) return false

    pendingEdits.delete(m.sender)

    await m.react('⏳')

    try {
      await conn.sendMessage(m.chat, {
        video: item.videoBuffer,
        ptv: true,
        caption: `🎬 ${item.title}`
      }, { quoted: m })

      await m.react('✅')
    } catch (e) {
      console.error('[edit-download] خطأ:', e.message)
      await m.react('❌')
      await conn.reply(m.chat, '❌ فشل إرسال الفيديو.', m)
    }

    return true
  }

  return false
}

handler.help = ['ايديت <اسم الشخصية>']
handler.tags = ['downloader']
handler.command = /^(ايديت|edit)$/i

export default handler
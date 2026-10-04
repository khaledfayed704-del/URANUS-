/*╭━━━〔 🧊 𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇 - 16 VIDEO 〕━━━╮
│ 🧊 المطور ↜ 𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇
│ ⚡ 16 فيديو كورسول
│ 🛡️ ⎙╎𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇 🧊
╰━━━━━━━━━━━━━━━━━━╯
*/

import crypto from 'crypto'
import axios from 'axios'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from "@whiskeysockets/baileys"

const KEY = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
const innertubeKey = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'

function decode(enc) {
  const data = Buffer.from(enc, 'base64')
  const iv = data.slice(0, 16)
  const ct = data.slice(16)
  const dc = crypto.createDecipheriv('aes-128-cbc', Buffer.from(KEY, 'hex'), iv)
  return JSON.parse(Buffer.concat([dc.update(ct), dc.final()]).toString())
}

async function getCdn() {
  const { data } = await axios.get('https://media.savetube.vip/api/random-cdn', { timeout: 10000 })
  return data.cdn
}

async function getDirectUrl(youtubeUrl, quality = '360') {
  const cdn = await getCdn()
  const infoRes = await axios.post(`https://${cdn}/v2/info`, { url: youtubeUrl }, {
    headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://save-tube.com/' }, timeout: 15000
  })
  const info = decode(infoRes.data.data)
  const dlRes = await axios.post(`https://${cdn}/download`, {
    downloadType: 'video', quality, key: info.key
  }, { headers: { 'Content-Type': 'application/json', Referer: 'https://save-tube.com/' }, timeout: 20000 })
  return { title: info.title, url: dlRes.data.data.downloadUrl }
}

async function downloadVideoBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 120000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://save-tube.com/',
      'Accept': '*/*'
    }
  })
  const buffer = Buffer.from(res.data)
  if (buffer.length < 50000) throw new Error('ملف صغير')
  if (buffer.slice(0, 300).toString().toLowerCase().includes('<html')) throw new Error('HTML')
  return buffer
}

function findRenderers(node, out = []) {
  if (!node || typeof node!== 'object') return out
  if (node.videoRenderer?.videoId) out.push(node.videoRenderer)
  for (let k in node) findRenderers(node[k], out)
  return out
}

async function searchYoutube16(q) {
  const res = await fetch(`https://www.youtube.com/youtubei/v1/search?key=${innertubeKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Youtube-Client-Name': '1', 'X-Youtube-Client-Version': '2.20240101.00.00' },
    body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: '2.20240101.00.00', hl: 'ar', gl: 'EG' } }, query: q })
  })
  const json = await res.json()
  const found = findRenderers(json.contents)
  return found.slice(0, 16).map(v => ({
    title: v.title?.runs?.[0]?.text || q,
    author: v.ownerText?.runs?.[0]?.text || 'YouTube',
    url: `https://www.youtube.com/watch?v=${v.videoId}`
  }))
}

async function buildAndSendCarousel(conn, chat, m, title, videosChunk) {
  const cards = []
  for (let v of videosChunk) {
    const { videoMessage } = await generateWAMessageContent({ video: v.buffer }, { upload: conn.waUploadToServer })
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({ text: `⚡ ${v.author}` }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: '🛡️ 𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇 🧊' }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: v.title.slice(0, 50),
        hasMediaAttachment: true,
        videoMessage
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
    })
  }

  const headerText = `─── ✧ *𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇* ✧ ───\n\n🧊 | 📖 **بحث: ${title}\n⚡ | 🎬 فيديوهات: ${cards.length}**\n\n─── ✧ 🛡️ *𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇* 🧊 ───`.trim()

  const msg = generateWAMessageFromContent(chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({ text: headerText }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: '🧊 𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇 | 16 VIDEO ⚡🛡️' }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(chat, msg.message, { messageId: msg.key.id })
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`🧊 اكتب: ${usedPrefix}${command} كيلوا`)

  const queryText = args.join(' ')
  const query = queryText + ' edit'
  await conn.sendMessage(m.chat, { react: { text: '🧊', key: m.key } })

  try {
    let results = await searchYoutube16(query)
    if (!results.length) return m.reply('🧊 ما لقيت نتائج ⚡')

    await conn.sendMessage(m.chat, { text: `🧊 لقيت ${results.length} فيديو، جاري التحميل... ⚡🛡️` }, { quoted: m })

    let validVideos = []
    for (let i = 0; i < results.length; i++) {
      let r = results[i]
      try {
        await conn.sendMessage(m.chat, { text: `⚡ يحمل ${i+1}/${results.length}: ${r.title.slice(0,30)}` }, { quoted: null }).then(s=>{setTimeout(()=>conn.sendMessage(m.chat,{delete:s.key}),2000)})
        let dl = await getDirectUrl(r.url, '360')
        let buffer = await downloadVideoBuffer(dl.url)
        validVideos.push({ title: r.title, author: r.author, buffer })
      } catch (e) {
        try {
          let dl2 = await getDirectUrl(r.url, '480')
          let buffer2 = await downloadVideoBuffer(dl2.url)
          validVideos.push({ title: r.title, author: r.author, buffer: buffer2 })
        } catch {}
      }
      if (validVideos.length >= 16) break
    }

    if (!validVideos.length) return m.reply('❌ كل الفيديوهات تالفة 🧊')

    if (validVideos.length > 10) {
      await buildAndSendCarousel(conn, m.chat, m, queryText + ' (1-10)', validVideos.slice(0, 10))
      await new Promise(r => setTimeout(r, 1500))
      await buildAndSendCarousel(conn, m.chat, m, queryText + ' (11-16)', validVideos.slice(10, 16))
    } else {
      await buildAndSendCarousel(conn, m.chat, m, queryText, validVideos)
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    m.reply(`❌ خطأ: ${e.message}`)
  }
}

handler.help = ['يوتيوب <اسم>']
handler.tags = ['downloader']
handler.command = /^(يوتيوب|yt|youtube)$/i
export default handler
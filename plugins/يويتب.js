import fetch from 'node-fetch'
import { join } from 'path'
import { tmpdir } from 'os'
import { createWriteStream, unlinkSync, statSync } from 'fs'
import { pipeline } from 'stream/promises'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


async function downloadFromSaveNow(url, quality) {
  const isAudio = quality === 'mp3'
  const format = isAudio ? 'mp3' : quality

  const initRes = await fetch(
    `https://p.savenow.to/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&add_info=1`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://savenow.to/',
        Origin: 'https://savenow.to'
      },
      timeout: 30000
    }
  )
  const initJson = await initRes.json()
  console.log('[YTDL] savenow init:', JSON.stringify(initJson).slice(0, 200))

  const jobId = initJson?.id
  if (!jobId) throw new Error('فشل بدء التحميل من SaveNow')

  let downloadUrl = null
  const maxTries = isAudio ? 30 : 60
  for (let i = 0; i < maxTries; i++) {
    await new Promise(r => setTimeout(r, 3000))

    const progRes = await fetch(
      `https://p.savenow.to/ajax/progress?id=${jobId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://savenow.to/'
        },
        timeout: 15000
      }
    )
    const progJson = await progRes.json()
    console.log('[YTDL] progress:', progJson?.progress, progJson?.text)

    if (progJson?.success === 1 && progJson?.download_url) {
      downloadUrl = progJson.download_url
      break
    }
    if (progJson?.error) throw new Error('فشل SaveNow: ' + progJson?.error)
  }

  if (!downloadUrl) throw new Error(`انتهى الوقت بعد ${maxTries * 3} ثانية — جرب جودة أقل`)
  return downloadUrl
}

let handler = async (m, { conn, args }) => {
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

  if (!args[0]) return

  const quality = args[0]
  const url = args.slice(1).join(' ')

  if (!url || (!url.includes('youtube') && !url.includes('youtu.be'))) {
    return m.reply('❌ 𖤐⃝🩸 رابط غير صالح')
  }

  const isAudio = quality === 'mp3'

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => {})
  await m.reply(`⏳ 𖤐⃝🩸 *جاري تحميل ${isAudio ? 'الصوت' : 'الفيديو ' + quality + 'p'}...*\n> 👁️⃝🩸 المصدر: SaveNow`)

  const ts = Date.now()
  const ext = isAudio ? 'mp3' : 'mp4'
  const outPath = join(tmpdir(), `yt_${ts}.${ext}`)

  try {
    const downloadUrl = await downloadFromSaveNow(url, quality)
    console.log('[YTDL] download url:', downloadUrl)

    const dlRes = await fetch(downloadUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 120000
    })
    if (!dlRes.ok) throw new Error(`فشل التحميل: ${dlRes.status}`)

    await pipeline(dlRes.body, createWriteStream(outPath))

    const size = statSync(outPath).size
    console.log('[YTDL] file size:', size)
    if (size < 1000) throw new Error('الملف صغير جداً')

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: outPath },
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: outPath },
        mimetype: 'video/mp4',
        caption: `> 🜲⃝☠️ *تم التحميل!*\n> 👁️⃝🩸 الجودة: ${quality}p\n> 👁️⃝🩸 المصدر: SaveNow\n>\n> ⚡ ⧼ ᏞᎩᏁᎾ᙭ ⧽ v2\n> ꒦꒷𓆩☣️𓆪꒷꒦ ✧ 🩸 🜲 🩸 ✧ ꒦꒷𓆩☣️𓆪꒷꒦`
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})

  } catch (err) {
    console.error('[YTDL] error:', err.message)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
    m.reply(`❌ 𓆩☠️𓆪 فشل التحميل: ${err.message} 𓆩☠️𓆪`)
  } finally {
    try { unlinkSync(outPath) } catch {}
  }
}

handler.help = ['ytv-dl']
handler.tags = ['downloader']
handler.command = /^ytv-dl$/i
export default handler
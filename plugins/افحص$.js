// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ المطور-افحص.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb7AkG84inotOc8BXE1K

//تـم الـتـطـويـر بـواسـطه مونتي

import fs from 'fs'
import path from 'path'
import url from 'url'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const handler = async (m, { conn }) => {
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

  await conn.reply(m.chat, '🏦 ⇦ ≺جـاري الـفـ🌿ـحـص....≺', m)

  try {
    // تحديد مسار مجلد البلوجنز
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
    const pluginsDir = path.resolve(__dirname, '../plugins')

    if (!fs.existsSync(pluginsDir)) {
      await conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على مجلد plugins في المسار الحالي!≺', m)
      return
    }

    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'))
    let results = []

    for (const file of files) {
      const filePath = path.join(pluginsDir, file)
      let error = null
      let commandInfo = null

      try {
        // قراءة الكود لاستخراج الأمر
        const code = fs.readFileSync(filePath, 'utf8')
        const match =
          code.match(/handler\.command\s*=\s*([^\n;]+)/i) ||
          code.match(/\.command\s*=\s*([^\n;]+)/i)
        if (match) commandInfo = match[0].trim()

        // 🟢 الإصـلاح: محاولة استيراد البلوجن مع إضافة استعلام زمني لتجاوز الـ Cache
        const dynamicPath = `${path.resolve(filePath)}?t=${Date.now()}`
        await import(dynamicPath)

      } catch (e) {
        error = e.message.split('\n')[0] || String(e)
      }

      results.push({
        file,
        error,
        commandInfo: commandInfo || 'لم يتم العثور على تعريف أمر'
      })
    }

    const total = results.length
    const errors = results.filter(r => r.error)
    const errorCount = errors.length

    let msg = `
🌿 ⇦ ≺أكـتـمـلت نـتـائج الـفـ🍁ـحـص 🌸≺

🌸 ⇦ ≺عـدد الـمـلفات فـي بـلوجنز : ${total}≺
🌿 ⇦ ≺عـدد الـمـلفات الـي فيـها ايرور : ${errorCount}≺
_____________________
`

    if (errorCount === 0) {
      msg += '✅ ⇦ ≺لا توجد أخطاء في أي ملف! البوت يعمل بكفاءة تامة ≺'
    } else {
      for (const r of errors) {
        msg += `
📂 ⇦ ≺اسـم الـمـلـف : ${r.file}≺
💢 ⇦ ≺الـخـطأ : ${r.error}≺
🧩 ⇦ ≺بـيـانـات الـمـلـف : ${r.commandInfo}≺
_____________________
`
      }
    }

    await conn.reply(m.chat, msg.trim(), m)
  } catch (err) {
    await conn.reply(
      m.chat,
      `❌ ⇦ ≺حدث خطأ غير متوقع أثناء الفحص:\n${err.message}≺`,
      m
    )
  }
}

handler.help = ['افحص']
handler.tags = ['owner']
handler.command = /^افحص$/i
handler.owner = true

export default handler
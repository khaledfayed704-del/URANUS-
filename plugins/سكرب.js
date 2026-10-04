import axios from 'axios'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


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

  const react = async (emoji) => {
    try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
  }

  if (!text) {
    await react('❌')
    return m.reply(`⚔️ *استخدام:*\n${usedPrefix}${command} [رابط]`)
  }

  let url = text.trim()
  if (!url.startsWith('http')) url = 'https://' + url

  try { new URL(url) } catch {
    await react('❌')
    return m.reply('❌ الرابط مش صحيح!')
  }

  await react('⏳')
  await m.reply('⏳ جاري جلب كود الموقع...')

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      maxRedirects: 5,
      validateStatus: (s) => s < 400,
    })

    const html = String(response.data)
    const sizeKB = (html.length / 1024).toFixed(1)
    
    // 🔥 تقطيع الكود إذا كان طويلاً (حد 4000 حرف)
    let codeMessage = `🌐 *المصدر:* ${url}\n📦 *الحجم:* ${sizeKB} KB\n\n\`\`\`html\n${html.substring(0, 3800)}\`\`\``
    
    if (html.length > 3800) {
      codeMessage += `\n\n⚠️ *الملف كبير جداً، تم إرسال أول 3800 حرف فقط*\n📁 *الملف الكامل مرفق أدناه*`
    }

    // ✅ إرسال الكود مباشرة في الشات أولاً
    await conn.sendMessage(m.chat, { text: codeMessage }, { quoted: m })
    
    // ✅ ثم إرسال الملف كامل
    await conn.sendMessage(m.chat, {
      document: Buffer.from(html, 'utf-8'),
      mimetype: 'text/plain',
      fileName: `source_${Date.now()}.txt`,
      caption: `📎 *الملف الكامل*\n🌐 ${url}\n📦 ${sizeKB} KB`
    }, { quoted: m })

    await react('⚡')

  } catch (e) {
    await react('❌')
    await m.reply('❌ ' + (e.message || 'خطأ غير معروف'))
  }
}

handler.help = ['سكرب']
handler.tags = ['tools']
handler.command = /^(سكرب|scrape|موقع)$/i

export default handler
// 🧊 𝐾𝐼𝐿𝐿𝑈𝐴 - اقتباس شغال
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const dir = './plugins'
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !['اقتبسهم.js','إصلاح.js'].includes(f))
  let done = 0

  for (let file of files) {
    let p = path.join(dir, file)
    try {
      let c = fs.readFileSync(p, 'utf8')
      if (c.includes('// KILLUA-QUOTE-OK')) continue
      if (c.includes('customPrefix') || c.includes('exec(')) continue // لا تحقن في أوامر النظام

      // نضيف تعريف الفيك في أول الملف بعد الـ imports
      let fakeDef = `// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\\nVERSION:3.0\\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\\nEND:VCARD' } }
};
`

      // نحط الفيك بعد آخر import
      let lines = c.split('\n')
      let lastImport = -1
      for (let i=0;i<lines.length;i++) if (lines[i].trim().startsWith('import ')) lastImport = i
      if (lastImport !== -1) {
        lines.splice(lastImport+1, 0, fakeDef)
        c = lines.join('\n')
      } else {
        c = fakeDef + '\n' + c
      }

      // نحقن override لـ m.reply بعد بداية الهاندلر
      let inject = `
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
`
      c = c.replace(/(let\s+handler\s*=\s*async.*?=>\s*\{)/, '$1' + inject)
      if (!c.includes('KILLUA REPLY OVERRIDE')) {
        c = c.replace(/(handler\s*=\s*async.*?=>\s*\{)/, '$1' + inject)
      }

      fs.writeFileSync(p, c, 'utf8')
      done++
    } catch {}
  }

  m.reply('✅ حقنت ' + done + ' ملف باقتباس 𝐾𝐼𝐿𝐿𝑈𝐴 🛡️ شغال')
}
handler.command = /^(اقتبسهم)$/i
handler.owner = true
export default handler

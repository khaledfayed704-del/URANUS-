// plugins/menu.js
// 🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻 - القائمة الرئيسية تارغاريان (مختصرة)

import { performance } from 'perf_hooks'
import fetch from 'node-fetch'
import { ButtonV2 } from '../System/NIXCODE.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const menuCooldown = {}

let handler = async (m, { conn, usedPrefix: _p }) => {
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

  try {
    let old = performance.now()
    let neww = performance.now()
    let speed = (neww - old).toFixed(4)

    const name = await conn.getName(m.sender)
    const isPrem = global.db.data.users[m.sender]?.premium || false
    const fecha = new Date().toLocaleDateString('ar-EG', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })
    const hora = new Date().toLocaleTimeString('ar-EG')
    const uptime = await getUptime()
    
    // ── متغيرات إضافية ──
    const energi = global.db.data.users[m.sender]?.energi || 0
    const koin = global.db.data.users[m.sender]?.koin || 0
    const totalCmd = Object.values(global.plugins).filter(v => v.help).length

    // ── زخارف تارغاريان ──
    const LINE = `━━ ╼╃ ⌬〔 ⦿⃟ᏌᏒᎪᏁᏌᏚ-ᏰᎾᎿ 〕⌬ ╾✦ ━━`
    const SEP = `╾❖ ━━ `

    // ── الواجهة بالشكل المطلوب (اقتباس) ──
    const bodyText = `${LINE}
> ├─ 🧧 الاسم : ${name} ${isPrem ? "✧" : ""}
> ├─ ⚜ المطور : ${global.ownerName || "𝐊𝐇𝐀_𝐋𝐘𝐍"}
> ├─ 🔷 التاريخ : ${fecha}
> └─ ⌛ الوقت : ${hora}
${SEP}
─── ‹ 📜 *☾ السِّجِل ☽*  › ───
> ♣️ الأثير : ${energi}/500
> ♦️ العملات : ${koin}
> ⏳ التشغيل : ${uptime}
> 👁️‍🗨️ الأوامر : ${totalCmd}
> ⚡ الاستجابة : ${speed}ms
${SEP}`

    await conn.sendMessage(m.chat, { react: { text: '👁️‍🗨️', key: m.key } })

    // ═══════════════════════════════════════
    // 🎯 القائمة الرئيسية - أزرار تارغاريان
    // ═══════════════════════════════════════
    await new ButtonV2(conn)
      .setBody(bodyText)
      .setFooter(' 『 ك۠وٓاِكٓبً ٍوّنْجْو۠م۠ 』 ')
      .setThumbnail('https://files.catbox.moe/3vlgrf.jpg')
      .addRawButton({
        buttonText: { displayText: '♚ ◂◄ الأرشــيــف ►▸ ♚' },
        buttonId: 'menu',
        type: 1,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: "اخـتـر الـقـسـم",
            sections: [{
              title: " 【 🪐 الأقــــســـام  】",
              rows: [
                { title: "👮‍♂️ قـسـم الأدمن", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق1" },
                { title: "🎨 قـسـم الاسـتـيـكـر", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق2" },
                { title: "🎮 قـسـم الألـعـاب", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق3" },
                { title: "📥 قـسـم الـتـحـمـيـلات", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق4" },
                { title: "🛠️ قـسـم الأدوات", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق5" },
                { title: "📚 قـسـم الـمـانـجـا", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق6" },
                { title: "🤖 قـسـم الـذكـاء", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق7" },
                { title: "👥 قـسـم الـنـقـابـات", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق8" },
                { title: "🖼️ قـسـم الـصـور", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق9" },
                { title: "🎉 قـسـم الـتـسـلـيـة", description: "🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ", id: ".ق10" }
              ]
            }]
          })
        }
      })
      .addButton('♣️ ◂◄ تَـكـويـن الـصَّـدع♣️  ►▸', '.تنصيب')
      .send(m.chat)

    // ✅ فيديو دائري - كل 10 دقائق
    const now = Date.now()
    if (!menuCooldown[m.chat] || (now - menuCooldown[m.chat]) > 10 * 60 * 1000) {
      menuCooldown[m.chat] = now
      try {
        await conn.sendMessage(m.chat, {
          video: { url: 'https://files.catbox.moe/haqsbe.|mp4' },
          mimetype: 'video/mp4',
          ptv: true
        }, { quoted: m });
      } catch (videoErr) {}
    }

  } catch (e) {
    console.error('[ᏞᎩᏁᎾ᙭-Menu] Error:', e);
  }
}

async function getUptime() {
  let totalSeconds = process.uptime()
  let hours = Math.floor(totalSeconds / 3600)
  let minutes = Math.floor((totalSeconds % 3600) / 60)
  let seconds = Math.floor(totalSeconds % 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['الاوامر', 'menu', 'اوامر', 'القائمة', 'منيو']

export default handler
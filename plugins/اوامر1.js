// plugins/اوامر1.js
// ✧ Lynox_BOT - قائمة أوامر الأدمن 👮‍♂️ (نسخة اوامر1 المستقلة)

import { existsSync } from 'fs'
import { join } from 'path'
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'
import fetch from 'node-fetch'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// ========== ثوابت جمالية ==========
const LINE = '▸ ═══════ ◈ ═══════ ◂'
const SEP  = '▸ ─────── • ✦ • ─────── ◂'

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
    // حساب البنج
    let old = performance.now()
    let neww = performance.now()
    let speed = (neww - old).toFixed(4)

    // معلومات المستخدم
    const name = await conn.getName(m.sender) || 'مستخدم'
    const fecha = new Date().toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'    
    })
    const hora = new Date().toLocaleTimeString('ar-SA')

    // ===== بيانات إضافية (يجب جلبها من قاعدة بياناتك) =====
    // إذا كان عندك نظام طاقة وعملات فاستبدل القيم التالية بالمتغيرات الصحيحة
    const isPrem = false // أو true إذا كان المستخدم بريميوم
    const energi = 100   // مثال: من db.data.users[m.sender].energi
    const koin = 50      // مثال: من db.data.users[m.sender].koin
    const uptime = process.uptime().toFixed(0) + ' ثانية' // أو استخدم دالة uptime الخاصة بك
    const totalCmd = 200 // عدد الأوامر الكلي

    // ===== نص الواجهة الجديد =====
    const bodyText = `${LINE}
✨ ⃢̸͢◈̚ *بِيَانَاتُ المُلَفّ* ◈̚ ⃢̸͢ ✨

> 🧧 ⃢̸͢ *الاسْـم* ❬ ${name} ${isPrem ? "✧" : ""} ❭
> ⚜️ ⃢̸͢ *المُطَـوِّر* ❬ ${global.ownerName || "𝐊𝐇𝐀_𝐋𝐘𝐍"} ❭
> 🔷 ⃢̸͢ *التَّارِيـخ* ❬ ${fecha} ❭
> ⌛ ⃢̸͢ *الوَقْـت* ❬ ${hora} ❭
${SEP}
👁️‍🗨️ ⃢̸͢◈̚ *السِّجِلُّ وَالـإِحْصَائِيَّات* ◈̚ ⃢̸͢ 👁️‍🗨️

> ♣️ ⃢̸͢ *الأَثِيـر* ❬ ${energi}/500 ❭
> ♦️ ⃢̸͢ *العُـمْلَات* ❬ ${koin} ❭
> ⏳ ⃢̸͢ *التَّشْغِيـل* ❬ ${uptime} ❭
> 📜 ⃢̸͢ *الأَوَامِـر* ❬ ${totalCmd} ❭
> ⚡ ⃢̸͢ *السُّرْعَـة* ❬ ${speed}ms ❭
${SEP}`

    await conn.sendMessage(m.chat, { react: { text: '💫', key: m.key } })

    const channel = "https://www.whatsapp.com/channel/0029Vb8ZUjKDJ6Gyl6ZCc00Q"
    const developerNumber = "رقم المطور 3"
    const developerContact = `https://wa.me/${developerNumber}`
    const imageUrl = 'https://files.catbox.moe/xs4tvg.jpeg'
    
    // === إنشاء nativeFlowPayload ===
    const nativeFlowPayload = {
      body: { text: bodyText }, // تم استخدام النص الجديد
      footer: { text: '🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ ' },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: "♚ ◂◄ الأقـسـام ►▸ ♚'",
              sections: [
                {
                  title: "اخـتـر الـقـسـم الـمـطـلـوب",
                  rows: [
                    { "title": "👮‍♂️ قـسـم الأدمن", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".اوامر1" },
                    { "title": "🎨 قـسـم الاسـتـيـكـر", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق2" },
                    { "title": "🎮 قـسـم الألـعـاب", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق3" },
                    { "title": "🔍 قـسـم الـبـحـث و الـتـحـمـيـل", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق4" },
                    { "title": "🧰 قـسـم الأدوات", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق5" },
                    { "title": "🔧 قـسـم المانجا", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق6" },
                    { "title": "🤖 الـذكـاء الاصـطـنـاعـي", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق7" },
                    { "title": "🎌 قـسـم الـنـقـابـات", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق8" },
                    { "title": "🖼️ قـسـم الـصـور", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق9" },
                    { "title": "⛄ قـسـم الـتـسـلـيـة", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق10" }
                  ]
                }
              ]
            })
          },
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: "♣️ ◂◄ تَـنصيب الـصَّـدع ►▸♣️",
              id: ".تنصيب"
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "◂◄ قناة ᏞᎩᏁᎾ᙭ ►▸",
              url: channel
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "◂◄ المـــطـــور ᏞᎩᏁᎾ᙭ ►▸",
              url: developerContact
            })
          }
        ],
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: `⚡ ${speed}ms`,
            url: developerContact,
            copy_code: `المطور: +${developerNumber}`,
            expiration_time: Date.now() + 86400000
          },
          bottom_sheet: {
            in_thread_buttons_limit: 1,
            divider_indices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999],
            list_title: "🪐 قـائـمـة أقـسـام Lynox_BOT",
            button_title: "▻ عـرض الأقـسـام ⚡"
          },
          tap_target_configuration: {
            description: "ابـدأ الآن مـع Lynox_BOT",
            canonical_url: developerContact,
            domain: "https://ryzobot.vercel.app",
            button_index: 0
          }
        })
      }
    }

    // إضافة header مع الصورة
    try {
      const imageRes = await fetch(imageUrl)
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer())
      const media = await prepareWAMessageMedia({ image: imageBuffer }, { upload: conn.waUploadToServer })
      nativeFlowPayload.header = {
        hasMediaAttachment: true,
        subtitle: '🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ ',
        imageMessage: media.imageMessage
      }
    } catch (e) {
      nativeFlowPayload.header = { 
        hasMediaAttachment: false,
        subtitle: '🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ '
      }
    }

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload)
    const fkontak = await makeFkontak()
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { 
      userJid: conn.user.jid, 
      quoted: fkontak 
    })
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('[Lynox-اوامر1]', e)
    await conn.sendMessage(m.chat, {
      text: `🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ \n\n⚠️ خطأ في تحميل القائمة`
    }, { quoted: m })
  }
}

async function makeFkontak() {
  try {
    const res = await fetch('https://file.garden/aauvg01sjleV_ic1/download%20(5).jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Lynox' },
      message: { locationMessage: { name: '🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ ', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined
  }
}

handler.help = ['اوامر1']
handler.tags = ['main']
handler.command = /^(اوامر1|أوامر1)$/i

export default handler
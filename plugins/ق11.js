// plugins/ق11.js
// ✧ Lynox_BOT - قسم المطور 🔧 (للمطور فقط)

import { existsSync } from 'fs'
import { join } from 'path'
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'
import fetch from 'node-fetch'
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, usedPrefix: _p, isROwner, isOwner }) => {
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

  // ✅ التحقق: إذا كان المستخدم ليس مطور → لا يحدث شيء
  if (!isROwner && !isOwner) {
    return;
  }

  try {
    // حساب البنج
    let old = performance.now()
    let neww = performance.now()
    let speed = (neww - old).toFixed(4)

    // معلومات المستخدم
    const user = await conn.getName(m.sender)
    const fecha = new Date().toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'    
    })
    const hora = new Date().toLocaleTimeString('ar-SA')

    await conn.sendMessage(m.chat, { react: { text: '🔧', key: m.key } });

    // صورة قسم المطور
    const imageUrl = 'https://files.catbox.moe/p6sbrw.jpg';
    const imageRes = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const media = await prepareWAMessageMedia({ image: imageBuffer }, { upload: conn.waUploadToServer });

    let menuText = `   ⃝⃘︢︣֟፝  ⦿⃟ᏌᏒᎪᏁᏌᏚ-ᏰᎾᎿ
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦┤
│
│ 🪐 *قـسـم الـمـطـور*
│
│ 🪐 ═══════════════ 🪐
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ الاسم: ${user}
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ الرقم: ${m.sender.split('@')[0]}
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ البينج: ${speed}ms
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ التاريخ: ${fecha}
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ الوقت: ${hora}
│
│ 🪐 ═══════════════ 🪐
│ 🔧 *أوامر المطور:*
│
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بلوقن
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بلوقن لست
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بلوقن عرض
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بلوقن حذف
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بنج
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}حظر_جروب
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}اطلع
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}اخر30
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}كود
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بصمه
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}تنفيذ
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}بوست
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}اعاده
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}لفل_اب
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}سكربتي
├ׁ̟̇˚₊· ⤷ 🪐 ⤶ ${_p}هش
│
│ 🪐 ═══════════════ 🪐
│ ⚠️ *جميع الأوامر للمطور فقط*
│
𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี ͟͟͞͞┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦┄꯭๋━┄꫶︦━┄꫶︦┄꯭๋━┄꯭๋━┄꫶︦╯`;

    const channel = "https://whatsapp.com/channel/0029VbCJtCILI8YQz9VFQQ2w"
    const developerNumber = "رقم المطور 3"
    const developerContact = `https://wa.me/${developerNumber}`

    const nativeFlowPayload = {
      body: { text: menuText },
      footer: { text: '🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻 🪐' },
      header: {
        hasMediaAttachment: true,
        subtitle: '🔧 قـسـم الـمـطـور',
        imageMessage: media.imageMessage
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: "📂 عـرض الأقـسـام",
              sections: [
                {
                  title: "اخـتـر الـقـسـم الـمـطـلـوب",
                  rows: [
                    { "title": "👮‍♂️ قـسـم الأدمن", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق1" },
                    { "title": "🎨 قـسـم الاسـتـيـكـر", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق2" },
                    { "title": "🎮 قـسـم الألـعـاب", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق3" },
                    { "title": "🔍 قـسـم الـبـحـث و الـتـحـمـيـل", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق4" },
                    { "title": "🧰 قـسـم الأدوات", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق5" },
                    { "title": "📚 قـسـم الـمـانـجـا", "description": "🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻", "id": ".ق6" },
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
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "📢 الـقـنـاة",
              url: channel
            })
          },
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "👑 الـمـطـور",
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
    };

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload);
    const fkontak = await makeFkontak();
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { 
      userJid: conn.user.jid, 
      quoted: fkontak 
    });
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error('[Lynox-Developer]', e);
    await conn.sendMessage(m.chat, { 
      text: theme.build([
        { type: 'title', text: '🪐 ᏞᎩᏁᎾ᙭_𝑩𝑶𝑻: "خطأ"' },
        { type: 'warning', text: 'حدث خطأ في تحميل قسم المطور' }
      ])
    }, { quoted: m });
  }
}

async function makeFkontak() {
  try {
    const res = await fetch('https://file.garden/aauvg01sjleV_ic1/nier%20automata%20by%20GoddessMechanic.jpg');
    const thumb2 = Buffer.from(await res.arrayBuffer());
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Lynox' },
      message: { locationMessage: { name: '🪐 ᏌᎡᎯ ᏁᏌᏚ_Ᏸ ᏫᎿ ', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    };
  } catch {
    return undefined;
  }
}

handler.help = ['ق11'];
handler.tags = ['main'];
handler.command = ['ق11'];
handler.rowner = true;

export default handler;
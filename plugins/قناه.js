// plugins/channel-info.js
// 🕷️ Raiden Shogun - معلومات القناة 📢

import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from '@whiskeysockets/baileys'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { text, conn }) => {
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
    return m.reply(`🕷️ *مـعـلـومـات الـقـنـاة*\n\n🔗 .قناة https://whatsapp.com/channel/xxxx`)
  }

  if (!text.includes('whatsapp.com/channel/')) {
    return m.reply(`❌ رابـط غـيـر صـحـيـح\nتأكد من رابط القناة`)
  }

  let channelId = text.split('channel/')[1]?.split(/[/?]/)[0]
  if (!channelId) return m.reply(`❌ تعذر استخراج معرف القناة`)

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  let res
  try {
    res = await conn.newsletterMetadata('invite', channelId)
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply(`⚠️ حدث خطأ أثناء جلب بيانات القناة`)
  }

  if (!res?.thread_metadata) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply(`❌ لم يتم العثور على بيانات القناة`)
  }

  const meta = res.thread_metadata
  const name = meta.name?.text || 'غير معروف'
  const description = meta.description?.text || 'لا يوجد'
  const subscribers = meta.subscribers_count || 'غير متاح'
  const verification = meta.verification === 'VERIFIED' ? 'مُحققة ✅' : 'غير مُحققة ❌'

  const previewUrl = meta.preview?.direct_path
    ? `https://mmg.whatsapp.net${meta.preview.direct_path}`
    : null

  let imgMsg = null
  if (previewUrl) {
    try {
      imgMsg = await prepareWAMessageMedia(
        { image: { url: previewUrl } },
        { upload: conn.waUploadToServer }
      )
    } catch {}
  }

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: { 
            text: `🕷️ *مـعـلـومـات الـقـنـاة*\n\n📢 *الاسـم:* ${name}\n🆔 *الـمـعـرف:* ${res.id}\n👥 *الـمـشـتـركـيـن:* ${subscribers}\n✅ *الـتـحـقـيـق:* ${verification}\n📝 *الـوصـف:* ${description}`
          },
          footer: { text: '🕷️ Raiden Shogun 🕷️' },
          header: imgMsg ? {
            hasMediaAttachment: true,
            imageMessage: imgMsg.imageMessage
          } : { hasMediaAttachment: false },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '📋 نسخ معرف القناة',
                  copy_code: res.id
                })
              }
            ],
            messageParamsJson: ''
          }
        })
      }
    }
  }, { userJid: conn.user.jid, quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['قناه']
handler.tags = ['tools']
handler.command = /^(قناه|channel|قناتي)$/i

export default handler
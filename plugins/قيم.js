// plugins/rate.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B — تقييم البوت ⭐

import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn }) => {
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
    // ⬇️ تحضير الصورة
    const imageUrl = 'https://file.garden/aauvg01sjleV_ic1/%E3%83%BB%F0%9F%8C%80%E2%96%95%E2%96%8F2%F0%9D%90%81%20%E3%80%90%E3%82%BF%E3%82%A4%E3%83%97B%E3%80%91.jpg'
    const mediaMessage = await prepareWAMessageMedia(
      { image: { url: imageUrl } },
      { upload: conn.waUploadToServer }
    )

    // ⬇️ إنشاء رسالة التقييم
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `   ⃝⃘︢︣֟፝ · ͟͟͞͞𝐘𝐨𝐑𝐇𝐚· ͟͟͞͞➳ 𝟐𝐁\n 🪐 ═══════════════  🪐\n│\n│ ⭐ *قـيـم تـجـربـتـك*\n│ 🔮 *كـيـف كـانـت خـدمـة ᏌᏒ؟*\n│\n 🪐 ═══════════════  🪐`
          }),

          footer: proto.Message.InteractiveMessage.Footer.create({
            text: ' 🪐 ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B  🪐'
          }),

          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: true,
            ...mediaMessage
          }),

          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  flow_message_version: "3",
                  flow_token: JSON.stringify({
                    ticket_id: Date.now().toString()
                  }),
                  flow_id: "0",
                  flow_cta: "⭐ قـيـم الـتـجـربـة",
                  flow_action: "navigate",
                  flow_action_payload: {
                    screen: "SATISFACTION_SCREEN",
                    data: {
                      title: "⭐ قـيـم تـجـربـتـك",
                      continue_label: "مـتـابـعـة ←",
                      satisfaction_screen_question: "ما مدى رضاك عن تجربة البوت؟",
                      very_satisfied_label: "😍 راضـي جـداً",
                      slightly_satisfied_label: "🙂 راضـي",
                      neutral_label: "😐 مـحـايـد",
                      slightly_dissatisfied_label: "😕 غـيـر راضـي",
                      very_dissatisfied_label: "😡 غـيـر راضـي أبـداً",
                      helpfulness_screen_question: "ما مدى فائدة البوت بالنسبة لك؟",
                      very_helpful_label: "💪 مـفـيـد جـداً",
                      slightly_helpful_label: "👍 مـفـيـد",
                      slightly_unhelpful_label: "👎 غـيـر مـفـيـد",
                      very_unhelpful_label: "💔 غـيـر مـفـيـد أبـداً",
                      question_answered_screen_question: "هل استطاع البوت تلبية احتياجاتك؟",
                      yes_label: "✅ نـعـم",
                      no_label: "❌ لا",
                      improvement_suggestion_label: "📝 اقـتـراحـات لـلـتـحـسـيـن",
                      submit_label: "📤 إرسال"
                    }
                  },
                  flow_metadata: {
                    flow_json_version: 700,
                    data_api_protocol: null,
                    data_api_version: null,
                    flow_name: "In-App CSAT Survey No Agent v3 - en_US_v1",
                    creation_source: "CSAT",
                    categories: []
                  },
                  icon: "DEFAULT",
                  has_multiple_buttons: false
                })
              }
            ],
            messageParamsJson: JSON.stringify({
              bottom_sheet: {
                in_thread_buttons_limit: 3,
                divider_indices: []
              },
              catalog_params: {
                features: ["cart"]
              }
            })
          })
        })
      },
      {
        userJid: conn.user.jid,
        quoted: m
      }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('[ᏌᏒ-Rate]', e)
    await conn.sendMessage(m.chat, { text: '>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🔮 حدث خطأ في تحميل نظام التقييم' }, { quoted: m })
  }
}

handler.command = ['rate', 'تقييم', 'قيم']
handler.help = ['rate']
handler.tags = ['main']

export default handler
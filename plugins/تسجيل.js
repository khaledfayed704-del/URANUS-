// plugins/signup.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - زر التسجيل التفاعلي 📝

import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'
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


    const contentMsg = {
        "interactiveMessage": {
            "header": {
                "title": " 🪐 ᏌᏒ - LynoX bot"
            },
            "body": {
                "text": "https://github.com/KHALED_LY"
            },
            "nativeFlowMessage": {
                "buttons": [
                    {
                        "name": "inapp_signup",
                        "buttonParamsJson": "{}"
                    }
                ],
                "messageParamsJson": "{}"
            }
        }
    }

    const webMsg = proto.Message.fromObject(contentMsg)
    const waMsg = generateWAMessageFromContent(m.chat, webMsg, {
        userJid: conn.user.jid,
        quoted: {
            "key": {
                "remoteJid": m.chat,
                "fromMe": false,
                "id": m.key.id,
                "participant": m.sender
            },
            "message": {
                "extendedTextMessage": {
                    "text": " 🪐",
                    "previewType": "NONE",
                    "contextInfo": {
                        "stanzaId": m.key.id,
                        "participant": m.sender,
                        "quotedMessage": {
                            "interactiveMessage": {
                                "header": {
                                    "title": " 🪐 ᏌᏒ - LynoX bot"
                                },
                                "body": {
                                    "text": "https://github.com/KHALED_LY"
                                },
                                "nativeFlowMessage": {
                                    "buttons": [
                                        {
                                            "name": "inapp_signup",
                                            "buttonParamsJson": "{}"
                                        }
                                    ],
                                    "messageParamsJson": "{}"
                                }
                            }
                        },
                        "expiration": 7776000,
                        "disappearingMode": {
                            "initiator": "CHANGED_IN_CHAT",
                            "trigger": "UNKNOWN"
                        },
                        "quotedType": "EXPLICIT"
                    },
                    "inviteLinkGroupTypeV2": "DEFAULT"
                },
                "messageContextInfo": {
                    "messageSecret": "8aMLB+/F6SKPzZ/uxBU9QeUeFhRtUtqDTrhLRffJn4w=",
                    "limitSharingV2": {
                        "sharingLimited": true,
                        "trigger": "CHAT_SETTING",
                        "limitSharingSettingTimestamp": Date.now().toString(),
                        "initiatedByMe": false
                    }
                }
            },
            "messageTimestamp": Math.floor(Date.now() / 1000).toString(),
            "broadcast": false,
            "pushName": " 🪐 ᏌᏒ - LynoX bot",
            "verifiedBizName": " 🪐 ᏌᏒ - LynoX bot"
        }
    })

    await conn.relayMessage(m.chat, waMsg.message, { messageId: waMsg.key.id })
}

handler.help = ['تسجيل']
handler.tags = ['main']
handler.command = /^(تسجيل|signup|register)$/i

export default handler

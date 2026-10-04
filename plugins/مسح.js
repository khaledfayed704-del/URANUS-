// plugins/مسح.js
// ✧ ✧𝐅𝐀𝐍𝐈𝐓𝐀𝐒_𝐁𝐎𝐓 - مسح الرسائل 🗑️

import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


async function execute({ sock, msg, sender }) {
    const chat = msg.key.remoteJid;

    // =====================================================
    // إرسال الرد بنفس شكل Interactive FANITAS
    // =====================================================
    async function sendWithVerification(text) {
        try {
            const message = generateWAMessageFromContent(
                chat,
                {
                    messageContextInfo: {
                        messageSecret: "ibysk3fl09VcpuewpVJri/az0lSSfMQ/6trHyiCSRQI=",
                        threadId: [
                            {
                                threadType: 1,
                                threadKey: {
                                    remoteJid: "status@broadcast",
                                    fromMe: false,
                                    id: "V14L3Y528D9F8B00F10FA9E",
                                    participant: "رقم المشارك@c.us"
                                }
                            }
                        ]
                    },
                    interactiveMessage: {
                        header: {
                            title: "✦ 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 ✦",
                            subtitle: "",
                            hasMediaAttachment: false
                        },
                        body: {
                            text
                        },
                        footer: {
                            text: "✦ 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓 ✦"
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "✅ تأكيد",
                                        id: "confirm_delete"
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "❌ إلغاء",
                                        id: "cancel_delete"
                                    })
                                }
                            ],
                            messageParamsJson: "{}"
                        },
                        contextInfo: {
                            participant: "رقم المشارك@s.whatsapp.net",
                            quotedMessage: {
                                groupInviteMessage: {
                                    groupJid: "0@g.us",
                                    inviteCode: "fanitas",
                                    caption: "✦ 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 𝐁𝐎𝐓 ✦"
                                }
                            },
                            remoteJid: "status@broadcast",
                            expiration: 0,
                            quotedType: 0
                        }
                    }
                },
                {
                    userJid: sock.user?.id
                }
            );

            await sock.relayMessage(
                chat,
                message.message,
                {
                    messageId: message.key.id,
                    additionalNodes: [
                        {
                            tag: "biz",
                            attrs: {},
                            content: [
                                {
                                    tag: "interactive",
                                    attrs: {
                                        type: "native_flow",
                                        v: "1"
                                    },
                                    content: [
                                        {
                                            tag: "native_flow",
                                            attrs: {
                                                v: "9",
                                                name: "mixed"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );

        } catch (err) {
            console.error("خطأ في إرسال Interactive:", err);
        }
    }

    // =====================================================
    // التنفيذ
    // =====================================================
    try {
        // ✅ التحقق من أن المستخدم مطور
        const isOwner = global.owner.some(n => 
            n === sender || 
            n + '@lid' === sender || 
            n + '@s.whatsapp.net' === sender
        );

        if (!isOwner) {
            return await sendWithVerification("❌ *هذا الأمر للمطور فقط!*");
        }

        if (!chat.endsWith("@g.us")) {
            return await sendWithVerification("❌ *هذا الأمر يعمل فقط في الجروبات!*");
        }

        const quoted = msg.quoted || msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quoted || !quoted.stanzaId) {
            return await sendWithVerification("⚠️ *قم بالرد على الرسالة التي تريد مسحها!*");
        }

        // =================================================
        // مسح الرسالة
        // =================================================
        await sock.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: quoted.stanzaId,
                participant: quoted.participant || chat
            }
        });

        // =================================================
        // الرد بعد المسح
        // =================================================
        await sendWithVerification("✅ *تم مسح الرسالة بنجاح!*");

    } catch (err) {
        console.error("خطأ في أمر المسح:", err);
        await sendWithVerification(`❌ *فشل مسح الرسالة*\n\n> ${err.message || 'خطأ غير معروف'}`);
    }
}

export const FANITAS = {
    command: "مسح",
    description: "مسح رسالة بالريبلاي",
    owner: true,
    group: true,
    private: false
};

export default {
    FANITAS,
    execute
};
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

    // مصفوفة صور Nezuko للاختيار العشوائي
    const nezukoImages = [
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko1.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko2.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko3.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko4.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko5.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko6.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko7.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko8.jpg',
        'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko9.jpg'
    ];
    
    const randomImage = nezukoImages[Math.floor(Math.random() * nezukoImages.length)];

    await conn.relayMessage(
        m.chat,
        {
            messageContextInfo: {
                messageSecret: "v/3VN8Gfr2dbKzgt1GKDEU7ovyYW+nswh4Duwq6KDuU="
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        unifiedResponse: {
                            data: Buffer.from(JSON.stringify({
                                "response_id": conn.generateMessageTag(),
                                "sections": [
                                    {
                                        "view_model": {
                                            "primitive": {
                                                "__typename": "GenAIImagePrimitive",
                                                "preview_image": {
                                                    "__typename": "GenAIMediaItem",
                                                    "mime_type": "image/jpeg",
                                                    "url": randomImage
                                                },
                                                "full_image": {
                                                    "__typename": "GenAIMediaItem",
                                                    "mime_type": "image/jpeg",
                                                    "url": randomImage
                                                }
                                            },
                                            "__typename": "GenAISingleLayoutViewModel"
                                        }
                                    },
                                    {
                                        "view_model": {
                                            "primitive": {
                                                "text": "✅ **تم تحميل لوحة التحكم الشاملة بـ 20 زراً تفاعلياً بنجاح!**",
                                                "__typename": "GenAIMarkdownTextUXPrimitive"
                                            },
                                            "__typename": "GenAISingleLayoutViewModel"
                                        }
                                    },
                                    {
                                        "view_model": {
                                            "primitives": [
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "القائمة السريعة 📌"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "القائمة الرئيسية 📜", "state": "PENDING", "kind": "OTHER", "tool_call_id": "01", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "MENU" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "الملف الشخصي 👤", "state": "PENDING", "kind": "OTHER", "tool_call_id": "02", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "PROFILE" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "السرعة والأداء ⚡", "state": "PENDING", "kind": "OTHER", "tool_call_id": "03", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "PING" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "أدوات النظام 🛠️"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "إعادة التشغيل 🔄", "state": "PENDING", "kind": "OTHER", "tool_call_id": "04", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "RESTART" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "المطور والدعم 👨‍💻", "state": "PENDING", "kind": "OTHER", "tool_call_id": "05", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "DEV" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "إعدادات البوت ⚙️", "state": "PENDING", "kind": "OTHER", "tool_call_id": "06", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "SETTINGS" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "أوامر الميديا 🎨"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "توليد صور 🖼️", "state": "PENDING", "kind": "OTHER", "tool_call_id": "07", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "IMAGINE" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "صنع ملصق 🗿", "state": "PENDING", "kind": "OTHER", "tool_call_id": "08", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "STICKER" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "تحميل فيديو 📥", "state": "PENDING", "kind": "OTHER", "tool_call_id": "09", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "DOWNLOAD" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader", "title": "الذكاء الاصطناعي 🤖"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "دردشة AI 🧠", "state": "PENDING", "kind": "OTHER", "tool_call_id": "10", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "AI_CHAT" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "تحسين كود 💻", "state": "PENDING", "kind": "OTHER", "tool_call_id": "11", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "AI_CODE" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "ترجمة نصوص 🌐", "state": "PENDING", "kind": "OTHER", "tool_call_id": "12", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "TRANSLATE" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "ألعاب وتسلية 🎮"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "تخمين الصورة 🧩", "state": "PENDING", "kind": "OTHER", "tool_call_id": "13", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "GAME_GUESS" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "أسئلة دينية 🕌", "state": "PENDING", "kind": "OTHER", "tool_call_id": "14", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "ISLAMIC" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "عجلة الحظ 🎡", "state": "PENDING", "kind": "OTHER", "tool_call_id": "15", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "SPIN" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "إدارة القروب 👥"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "منشن للجميع 📢", "state": "PENDING", "kind": "OTHER", "tool_call_id": "16", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "TAGALL" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "قفل المجموعة 🔒", "state": "PENDING", "kind": "OTHER", "tool_call_id": "17", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "CLOSE_GROUP" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "فتح المجموعة 🔓", "state": "PENDING", "kind": "OTHER", "tool_call_id": "18", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "OPEN_GROUP" } }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "__typename": "GenAI3PExtWidgetPrimitive",
                                                    "header": {
                                                        "__typename": "GenAI3PExtWidgetStandardHeader",
                                                        "title": "خدمات متنوعة 🌟"
                                                    },
                                                    "body": {
                                                        "__typename": "GenAI3PExtCalendarEventList",
                                                        "sections": [],
                                                        "ctas": [
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "اختصار رابط 🔗", "state": "PENDING", "kind": "OTHER", "tool_call_id": "19", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "SHORT_URL" } },
                                                            { "__typename": "GenAI3PExtWidgetCTA", "label": "حالة الطقس 🌤️", "state": "PENDING", "kind": "OTHER", "tool_call_id": "20", "toast": { "__typename": "GenAI3PExtWidgetToast", "label": "WEATHER" } }
                                                        ]
                                                    }
                                                }
                                            ],
                                            "__typename": "GenAIHScrollLayoutViewModel"
                                        }
                                    },
                                    {
                                        "view_model": {
                                            "primitives": [
                                                {
                                                    "__typename": "GenAIFooterActionPrimitive",
                                                    "cta_text": "قناة الواتساب 📢",
                                                    "cta_type": "OPEN_URL",
                                                    "cta_url": "https://whatsapp.com/channel/0029Vb7AkG84inotOc8BXE1K"
                                                },
                                                {
                                                    "__typename": "GenAIFooterActionPrimitive",
                                                    "cta_text": "الانستغرام 📸",
                                                    "cta_type": "OPEN_URL",
                                                    "cta_url": "https://instagram.com/monte4g"
                                                }
                                            ],
                                            "__typename": "GenAIHScrollLayoutViewModel"
                                        }
                                    }
                                ]
                            })).toString('base64')
                        },
                        contextInfo: {
                            isForwarded: true,
                            forwardingScore: 1,
                            forwardOrigin: 4,
                            forwardedAiBotMessageInfo: {
                                botJid: "867051314767696@bot"
                            }
                        }
                    }
                }
            }
        },
        { messageId: conn.generateMessageTag() }
    );
};

handler.help = ['واش'];
handler.tags = ['tools'];
handler.command = ['واش'];

export default handler;
// plugins/متقدم.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - رسائل Meta AI المتقدمة ✨

import { generateWAMessageFromContent, generateMessageIDV2 } from '@whiskeysockets/baileys';
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
        await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        // 1. إعدادات الـ Meta
        const botMeta = {
            isForwarded: true,
            forwardingScore: 1,
            forwardedAiBotMessageInfo: { 
                botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
        };

        // 2. جلب صورة البروفايل
        let imageUrl = 'https://i.imgur.com/8QKqSJp.jpeg';
        try {
            const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            imageUrl = await conn.profilePictureUrl(botJid, 'image');
        } catch(e) {}

        // 3. بناء الهيكل
        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [
                    {
                        messageType: 2,
                        messageText: "\n✨ * 🪐 ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B  🪐* ✨\n",
                    },
                    {
                        messageType: 2,
                        messageText: "\n📊 *1- جدول الأوامر:*\n",
                    },
                    {
                        messageType: 4,
                        tableMetadata: {
                            title: "أوامر ᏌᏒ",
                            rows: [
                                { items: ["الأمر", "الوصف", "مثال"], isHeading: true },
                                { items: [".اوامر", "القائمة الرئيسية", ".اوامر"], isHeading: false },
                                { items: [".مانهوا", "بحث عن مانهوا", ".مانهوا solo"], isHeading: false },
                                { items: [".كلود", "ذكاء Claude", ".كلود مرحبا"], isHeading: false },
                                { items: [".ملصقات", "صناعة ملصقات", ".ملصقات انمي"], isHeading: false }
                            ]
                        }
                    },
                    {
                        messageType: 2,
                        messageText: "\n💻 *2- كود JavaScript:*\n",
                    },
                    {
                        messageType: 5,
                        codeMetadata: {
                            codeLanguage: "javascript",
                            codeBlocks: [
                                { highlightType: 2, codeContent: 'const bot = {' },
                                { highlightType: 3, codeContent: '    name: "ᏌᏒ",' },
                                { highlightType: 4, codeContent: '    unit: "YoRHa No.2 Type B"' },
                                { highlightType: 1, codeContent: '};' }
                            ]
                        }
                    },
                    {
                        messageType: 2,
                        messageText: "\n🖼️ *3- صورة ᏌᏒ:*\n",
                    },
                    {
                        messageType: 3,
                        imageMetadata: {
                            imageUrl: {
                                imagePreviewUrl: imageUrl,
                                imageHighResUrl: imageUrl,
                                sourceUrl: "https://wa.me/رقم المطور 1"
                            },
                            imageText: " 🪐 ᏌᏒ - LynoX bot",
                            alignment: 2,
                            tapLinkUrl: "https://wa.me/رقم المطور 1"
                        }
                    }
                ],
                contextInfo: botMeta
            }
        };

        // 4. إنشاء الرسالة
        const msg = await generateWAMessageFromContent(m.chat, { 
            botForwardedMessage: { message: richMessage } 
        }, {
            senderId: conn.user.id,
            userJid: conn.user.id,
            messageId: generateMessageIDV2(conn.user.id)
        });

        // 5. إرسال الرسالة
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("[ᏌᏒ-Meta]", err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        // رسالة بديلة
        await conn.sendMessage(m.chat, {
            text: ">  🪐 *✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B  🪐*\n> \n> 📊 *جدول الأوامر*\n> ┌─────────┬─────────────┐\n> │ .اوامر  │ القائمة     │\n> │ .مانهوا │ بحث        │\n> │ .كلود   │ الذكاء     │\n> └─────────┴─────────────┘"
        }, { quoted: m });
    }
}

handler.help = ['متقدم'];
handler.tags = ['tools'];
handler.command = /^(متقدم|ميتا|meta|rich)$/i;

export default handler;
// plugins/revoke-link.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - تجديد رابط المجموعة 🔄

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
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

  if (!isAdmin) return global.dfail('admin', m, conn)
  if (!isBotAdmin) return global.dfail('botAdmin', m, conn)

  try {
    const groupId = m.chat;

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // تجديد رابط الدعوة
    const newInviteCode = await conn.groupRevokeInvite(groupId);
    const newLink = `https://chat.whatsapp.com/${newInviteCode}`;

    // الحصول على صورة المجموعة
    let groupImage;
    try {
      groupImage = await conn.profilePictureUrl(groupId, 'image');
    } catch (e) {
      groupImage = 'https://file.garden/aauvg01sjleV_ic1/2b676b830f863f489572f163466adb97.jpg';
    }

    // تجهيز الصورة للإرسال
    const media = await prepareWAMessageMedia(
      { image: { url: groupImage } },
      { upload: conn.waUploadToServer }
    );

    const teks = theme.build([
      { type: 'title', text: '🔄 تـم تـجـديـد الـرابـط' },
      { type: 'divider' },
      { type: 'line', text: ' 🪐 تم إنشاء رابط دعوة جديد للمجموعة' },
      { type: 'spacer' },
      { type: 'info', label: '🔗 الرابط', value: newLink },
      { type: 'divider' },
      { type: 'line', text: '⚔️ اضغط على الزر أدناه لنسخ الرابط' }
    ]);

    // إنشاء الرسالة التفاعلية مع الزر
    const msg = generateWAMessageFromContent(groupId, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: teks.trim() },
            footer: { text: '✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧' },
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: '📋 نسخ الرابط',
                    copy_code: newLink
                  })
                }
              ],
              messageParamsJson: ""
            }
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(groupId, msg.message, { messageId: msg.key.id });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(theme.build([
      { type: 'title', text: '❌ خـطـأ' },
      { type: 'error', text: 'حدث خطأ أثناء تجديد الرابط' }
    ]));
  }
};

handler.help = ['تجديد_الرابط'];
handler.tags = ['group'];
handler.command = /^(تجديد|تحديث_الرابط|newlink)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
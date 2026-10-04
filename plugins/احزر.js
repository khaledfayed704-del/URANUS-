// plugins/game-guess.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - لعبة احزر الشخصية 🎭

import { theme } from '../System/theme.js';
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const timeout = 60000;

let handler = async (m, { conn, command }) => {
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

    conn.obito = conn.obito || {};
    let id = m.chat;

    // معالج الإجابة على الأزرار
    if (command.startsWith('جوابي_')) {
        let obito = conn.obito[id];

        if (!obito) {
            return conn.reply(m.chat, theme.build([
                { type: 'title', text: '⚠️ تـنـبـيـه' },
                { type: 'subtitle', text: 'لا توجد لعبة نشطة الآن' }
            ]), m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, theme.build([
                { type: 'title', text: 'خـطـأ' },
                { type: 'subtitle', text: 'اختيار غير صالح' }
            ]), m);
        }

        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            if (!global.db.data.users[m.sender].points) {
                global.db.data.users[m.sender].points = 0;
            }
            global.db.data.users[m.sender].points += 500;

            await conn.reply(m.chat, theme.build([
                { type: 'title', text: '✅ إجـابـة صـحـيـحـة' },
                { type: 'subtitle', text: '🎉 مبروك! +500 نقطة' },
                { type: 'divider' },
                { type: 'info', label: 'الإجابة', value: obito.correctAnswer },
                { type: 'info', label: 'نقاطك', value: `${global.db.data.users[m.sender].points} نقطة` }
            ]), m);
            
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await conn.reply(m.chat, theme.build([
                    { type: 'title', text: '❌ إجـابـة خـاطـئـة' },
                    { type: 'subtitle', text: `المحاولات المتبقية: ${obito.attempts}` },
                    { type: 'divider' },
                    { type: 'line', text: '⚔️ حاول مرة أخرى' }
                ]), m);
            } else {
                await conn.reply(m.chat, theme.build([
                    { type: 'title', text: '❌ انـتـهـت الـمـحـاولـات' },
                    { type: 'subtitle', text: `الإجابة الصحيحة هي: ${obito.correctAnswer}` },
                    { type: 'divider' },
                    { type: 'line', text: '⚔️ استخدم .احزر للعب مرة أخرى' }
                ]), m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
        return;
    }

    // بدء لعبة جديدة
    try {
        if (conn.obito[id]) {
            return conn.reply(m.chat, theme.build([
                { type: 'title', text: '⚠️ تـنـبـيـه' },
                { type: 'subtitle', text: 'يوجد لعبة سابقة لم تنتهي' }
            ]), m);
        }

        const response = await fetch('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
        const obitoData = await response.json();

        const obitoItem = obitoData[Math.floor(Math.random() * obitoData.length)];
        const { img, name } = obitoItem;

        let options = [name];
        while (options.length < 4) {
            let randomItem = obitoData[Math.floor(Math.random() * obitoData.length)].name;
            if (!options.includes(randomItem)) options.push(randomItem);
        }
        options.sort(() => Math.random() - 0.5);

        const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

        // بناء الأزرار
        const buttons = options.map((option, index) => ({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: ` 🪐 ${option}`,
                id: `.جوابي_${index + 1}`
            })
        }));

        const interactiveMessage = {
            body: { 
                text: theme.build([
                    { type: 'title', text: '🎭 لـعـبـة احـزر الـشـخـصـيـة' },
                    { type: 'divider' },
                    { type: 'line', text: ' 🪐 *من هي هذه الشخصية؟*' },
                    { type: 'divider' },
                    { type: 'info', label: '⏰ الـوقـت', value: '60 ثانية' },
                    { type: 'info', label: '🎁 الجـائـزة', value: '500 نقطة' },
                    { type: 'info', label: '⚔️ المحاولات', value: '2' }
                ])
            },
            footer: { text: '✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧' },
            header: {
                hasMediaAttachment: true,
                subtitle: '🎭 اختر الإجابة الصحيحة',
                imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
                buttons: buttons,
                messageParamsJson: JSON.stringify({
                    bottom_sheet: {
                        list_title: "🎭 اختر اسم الشخصية",
                        button_title: "⚔️ الخيارات"
                    }
                })
            }
        };

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
                }
            }
        }, { userJid: conn.user.jid, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        conn.obito[id] = {
            correctAnswer: name,
            options: options,
            timer: setTimeout(async () => {
                if (conn.obito[id]) {
                    await conn.reply(m.chat, theme.build([
                        { type: 'title', text: '⏰ انـتـهى الـوقـت' },
                        { type: 'subtitle', text: `الإجابة الصحيحة هي: ${name}` },
                        { type: 'divider' },
                        { type: 'line', text: '⚔️ استخدم .احزر للعب مرة أخرى' }
                    ]), m);
                    delete conn.obito[id];
                }
            }, timeout),
            attempts: 2
        };

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, theme.build([
            { type: 'title', text: 'خـطـأ' },
            { type: 'subtitle', text: 'حدث خطأ في تحميل اللعبة' }
        ]), m);
    }
};

handler.help = ['احزر'];
handler.tags = ['game'];
handler.command = /^(احزر|احذر|جوابي_\d+)$/i;

export default handler;
import { delay } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    const text = "WELCOME TO UR";
    const { key } = await conn.sendMessage(m.chat, { text: "⏳" });

    // ═══════════════ المرحلة 1: مؤشر تحميل احترافي ═══════════════
    const loaders = [
        "▱▱▱▱▱▱▱▱▱▱",
        "▰▱▱▱▱▱▱▱▱▱",
        "▰▰▱▱▱▱▱▱▱▱",
        "▰▰▰▱▱▱▱▱▱▱",
        "▰▰▰▰▱▱▱▱▱▱",
        "▰▰▰▰▰▱▱▱▱▱",
        "▰▰▰▰▰▰▱▱▱▱",
        "▰▰▰▰▰▰▰▱▱▱",
        "▰▰▰▰▰▰▰▰▱▱",
        "▰▰▰▰▰▰▰▰▰▱",
        "▰▰▰▰▰▰▰▰▰▰",
    ];
    for (const bar of loaders) {
        await conn.sendMessage(m.chat, {
            text: `┌─────────────────┐\n   ⚡ *جاري التشغيل* ⚡\n   ${bar}\n└─────────────────┘`,
            edit: key
        }).catch(() => {});
        await delay(80);
    }

    // ═══════════════ المرحلة 2: مسح الشاشة ═══════════════
    const clears = [
        "╭──────────────────╮\n│                  │\n╰──────────────────╯",
        "╭──────────────────╮\n│ ▌                │\n╰──────────────────╯",
        "╭──────────────────╮\n│ ▐▌               │\n╰──────────────────╯",
        "╭──────────────────╮\n│ ▌▐▌              │\n╰──────────────────╯",
        "╭──────────────────╮\n│ ▐▌▐▌             │\n╰──────────────────╯",
    ];
    for (const frame of clears) {
        await conn.sendMessage(m.chat, { text: frame, edit: key }).catch(() => {});
        await delay(60);
    }

    // ═══════════════ المرحلة 3: كتابة النص بتأثير نيون ═══════════════
    const glowFrames = ['░', '▒', '▓'];
    let built = '';

    for (let i = 0; i < text.length; i++) {
        const realChar = text[i];

        // تأثير وميض قبل ظهور الحرف
        for (const g of glowFrames) {
            await conn.sendMessage(m.chat, {
                text: `╭━━━━━━━━━━━━━━━━━╮\n┃\n┃  ${built}${g}\n┃\n╰━━━━━━━━━━━━━━━━━╯`,
                edit: key
            }).catch(() => {});
            await delay(45);
        }

        built += realChar;
        await conn.sendMessage(m.chat, {
            text: `╭━━━━━━━━━━━━━━━━━╮\n┃\n┃  ${built}▌\n┃\n╰━━━━━━━━━━━━━━━━━╯`,
            edit: key
        }).catch(() => {});
        await delay(120);
    }

    // ═══════════════ المرحلة 4: تأثيرات احتفالية ═══════════════
    const celebrations = [
        `╭━━━━━━━━━━━━━━━━━╮\n┃\n┃  ${text}\n┃\n╰━━━━━━━━━━━━━━━━━╯`,
        `┏━━━━━━━━━━━━━━━━━┓\n┃\n┃  ✦ ${text} ✦\n┃\n┗━━━━━━━━━━━━━━━━━┛`,
        `✦━━━━━━━━━━━━━━━━━✦\n\n    ★ ${text} ★\n\n✦━━━━━━━━━━━━━━━━━✦`,
        `┏━━━━━━━━━━━━━━━━━┓\n┃  ★ ✦ ✦ ✦ ★  ┃\n┃   ${text}   ┃\n┃  ★ ✦ ✦ ✦ ★  ┃\n┗━━━━━━━━━━━━━━━━━┛`,
    ];
    for (const c of celebrations) {
        await conn.sendMessage(m.chat, { text: c, edit: key }).catch(() => {});
        await delay(200);
    }

    // ═══════════════ النتيجة النهائية الأنيقة ═══════════════
    const final = `
╔══════════════════════╗
║                      ║
║    ✨ *${text}* ✨     
║                      ║
╚══════════════════════╝

   _تم التشغيل بنجاح ✓_`;

    await conn.sendMessage(m.chat, { text: final, edit: key });
};

handler.command = ['تست'];
export default handler;
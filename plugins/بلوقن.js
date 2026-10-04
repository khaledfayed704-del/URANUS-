// plugins/بلوقن.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - إدارة البلوقنات 📦

import fs from "fs";
import path from "path";
import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import { generateWAMessageFromContent, generateMessageIDV2 } from '@whiskeysockets/baileys';
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, args, usedPrefix }) => {
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


    const react = async (e) => {
        try { await conn.sendMessage(m.chat, { react: { text: e, key: m.key } }); } catch {}
    };

    const pluginsDir = path.dirname(global.__filename(import.meta.url, true));
    const currentFile = path.basename(global.__filename(import.meta.url, true));
    const getPlugins = () => fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js") && f !== currentFile);

    const findPlugin = (name) => {
        let searchName = name.replace(/\.js$/i, "").trim().toLowerCase().replace(/\s+/g, '-');
        const allFiles = getPlugins();
        let found = allFiles.find(f => f.toLowerCase() === searchName + ".js");
        if (found) return found;
        found = allFiles.find(f => f.replace(/-/g, '_').toLowerCase() === searchName.replace(/-/g, '_') + ".js");
        if (found) return found;
        found = allFiles.find(f => f.toLowerCase().includes(searchName));
        if (found) return found;
        return null;
    };

    // ⭐ استخراج الأمر المستخدم وتحديد الإجراء والاسم
    const rawText = (m.text || m.body || '').trim();
    let usedCommand = '';
    if (rawText.startsWith(usedPrefix)) {
        usedCommand = rawText.slice(usedPrefix.length).trim().split(/\s+/)[0].toLowerCase();
    } else {
        usedCommand = rawText.split(/\s+/)[0].toLowerCase();
    }

    let action = '';
    let nameArg = '';

    if (/^(باتش)$/i.test(usedCommand)) {
        action = 'عرض';
        nameArg = args.join(' ').trim();
    } else if (/^(احذف)$/i.test(usedCommand)) {
        action = 'حذف';
        nameArg = args.join(' ').trim();
    } else if (/^(لست)$/i.test(usedCommand)) {
        action = 'لست';
    } else if (/^(ضيف)$/i.test(usedCommand)) {
        action = 'اضف';
    } else {
        // الأوامر القديمة: بلوقن / plugin / plugins
        action = (args[0] || '').toLowerCase();
        nameArg = args.slice(1).join(' ').trim();
    }

    // ⭐ عرض الكود - بنظام Rich Message
    if (/^(عرض|show|get)$/i.test(action)) {
        if (!nameArg) return m.reply(theme.build([
            { type: 'title', text: '📄 عـرض بـلـوقـن - ᏌᏒ' },
            { type: 'info', label: '📌 الاستخدام', value: `${usedPrefix}باتش <اسم>` }
        ]));

        const foundFile = findPlugin(nameArg);
        if (!foundFile) {
            await react("❌");
            return m.reply(theme.build([{ type: 'title', text: '❌ ᏌᏒ - خـطـأ' }, { type: 'error', text: `الملف "${nameArg}" غير موجود` }]));
        }

        const filePath = path.join(pluginsDir, foundFile);
        const code = fs.readFileSync(filePath, "utf-8");
        const fileSize = (code.length / 1024).toFixed(2);
        const totalLines = code.split('\n').length;

        await react("📄");

        // ✅ بناء الـ Rich Message مع botMeta
        const botMeta = {
            isForwarded: true,
            forwardingScore: 1,
            forwardedAiBotMessageInfo: { 
                botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
        };

        // تقسيم الكود إلى أجزاء صغيرة للعرض
        const codeLines = code.split('\n');
        const codeBlocks = [];
        let currentBlock = '';
        let blockType = 1; // 1 = عادي, 2 = عنوان, 3 = تعليق, 4 = كود رئيسي

        for (let i = 0; i < codeLines.length; i++) {
            const line = codeLines[i];
            if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                if (currentBlock) {
                    codeBlocks.push({ highlightType: blockType, codeContent: currentBlock });
                    currentBlock = '';
                }
                blockType = 3;
                currentBlock += line + '\n';
            } else if (line.includes('handler.') || line.includes('export')) {
                if (currentBlock) {
                    codeBlocks.push({ highlightType: blockType, codeContent: currentBlock });
                    currentBlock = '';
                }
                blockType = 2;
                currentBlock += line + '\n';
            } else if (line.trim() === '' || line.trim().startsWith('import') || line.trim().startsWith('const') || line.trim().startsWith('let')) {
                if (currentBlock && blockType !== 2 && blockType !== 3) {
                    blockType = 1;
                }
                currentBlock += line + '\n';
            } else {
                if (currentBlock && blockType !== 2 && blockType !== 3) {
                    blockType = 4;
                }
                currentBlock += line + '\n';
            }
        }
        if (currentBlock) {
            codeBlocks.push({ highlightType: blockType, codeContent: currentBlock });
        }

        // بناء الرسالة المتقدمة - كل الكود في رسالة واحدة
        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [
                    {
                        messageType: 2,
                        messageText: `\n📄 *${foundFile}*\n📦 ${fileSize} KB | 📝 ${totalLines} سطر\n⚡ ${global.watermark || '✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ✧'}\n`,
                    },
                    {
                        messageType: 2,
                        messageText: `\n💻 *الكود:*\n`,
                    },
                    {
                        messageType: 5,
                        codeMetadata: {
                            codeLanguage: "javascript",
                            codeBlocks: codeBlocks // كل الكود من غير حد
                        }
                    }
                ],
                contextInfo: botMeta
            }
        };

        try {
            const msg = await generateWAMessageFromContent(m.chat, { 
                botForwardedMessage: { message: richMessage } 
            }, {
                senderId: conn.user.id,
                userJid: conn.user.id,
                messageId: generateMessageIDV2(conn.user.id)
            });

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        } catch (err) {
            console.error("[ᏌᏒ-Plugin]", err);
            // لو فشل الـ Rich Message، نرسل كنص عادي
            await conn.sendMessage(m.chat, {
                text: `📄 *${foundFile}*\n📦 ${fileSize} KB | 📝 ${totalLines} سطر\n\n\`\`\`javascript\n${code}\n\`\`\``
            }, { quoted: m });
        }
        
        return;
    }

    // ⭐ لست
    if (/^(لست|list)$/i.test(action)) {
        const plugins = getPlugins();
        if (!plugins.length) {
            await react("📦");
            return m.reply(theme.build([{ type: 'title', text: '📂 ᏌᏒ - لا يـوجـد' }]));
        }

        const lines = [`${theme.divider}`, `│`, `│ 📦 *قـائـمـة الـبـلـوقـنـات - ᏌᏒ*`, `│`];
        plugins.forEach((f, i) => lines.push(`│ ${i + 1}. ${f.replace(".js", "")}`));
        lines.push(`│`, `│ 📊 المجموع: ${plugins.length} بلوقن`);
        lines.push(`${theme.endDivider}`);

        await react("📦");
        return m.reply(lines.join("\n"));
    }

    // ⭐ حذف
    if (/^(حذف|delete|del|remove)$/i.test(action)) {
        if (!nameArg) return m.reply(theme.build([
            { type: 'title', text: '🗑️ حـذف بـلـوقـن - ᏌᏒ' },
            { type: 'info', label: '📌 الاستخدام', value: `${usedPrefix}احذف <اسم>` }
        ]));

        const foundFile = findPlugin(nameArg);
        if (!foundFile) {
            await react("❌");
            return m.reply(theme.build([{ type: 'title', text: '❌ ᏌᏒ - خـطـأ' }, { type: 'error', text: `الملف "${nameArg}" غير موجود` }]));
        }

        const filePath = path.join(pluginsDir, foundFile);
        const code = fs.readFileSync(filePath, "utf-8");
        const fileSize = (code.length / 1024).toFixed(2);
        const lineCount = code.split('\n').length;

        fs.unlinkSync(filePath);
        if (global.plugins?.[foundFile]) delete global.plugins[foundFile];

        await react("🗑️");
        return m.reply(theme.build([
            { type: 'title', text: '🗑️ ᏌᏒ - تـم الـحـذف' },
            { type: 'divider' },
            { type: 'info', label: '📄 الملف', value: foundFile },
            { type: 'info', label: '📦 الحجم', value: `${fileSize} KB` },
            { type: 'info', label: '📝 الأسطر', value: `${lineCount} سطر` }
        ]));
    }

    // ⭐ إضافة
    if (/^(اضف|اضافه|اضافة|add)$/i.test(action)) {
        const quoted = m.quoted;
        if (!quoted) {
            await react("❌");
            return m.reply(theme.build([{ type: 'title', text: '❌ ᏌᏒ - خـطـأ' }, { type: 'error', text: 'رد على كود أو ملف البلوقن' }]));
        }

        let code = "";
        let fileName = "";

        const docMsg = quoted.message?.documentMessage || quoted.message?.documentWithCaptionMessage?.message?.documentMessage || null;

        if (docMsg) {
            let buffer;
            try { buffer = await quoted.download(); } catch {
                try {
                    const stream = await downloadContentFromMessage(docMsg, "document");
                    const chunks = [];
                    for await (const c of stream) chunks.push(c);
                    buffer = Buffer.concat(chunks);
                } catch (e) {
                    await react("❌");
                    return m.reply(`❌ ᏌᏒ - فشل تحميل الملف: ${e.message}`);
                }
            }
            const baseName = (docMsg.fileName || `plugin_${Date.now()}`).replace(/\.js$/i, "");
            fileName = `${baseName}.js`;
            code = buffer.toString("utf-8");
        } else {
            code = quoted.text || quoted.body || "";
            if (!code.trim()) {
                await react("❌");
                return m.reply(theme.build([{ type: 'title', text: '❌ ᏌᏒ - خـطـأ' }, { type: 'error', text: 'الرسالة مش فيها كود' }]));
            }
            
            // استخراج اسم الملف من الكود
            let extractedName = null;
            
            const cmdMatch1 = code.match(/handler\.command\s*=\s*\/\^\(?([^)\/|\\s]+)/);
            if (cmdMatch1) extractedName = cmdMatch1[1].trim();
            
            if (!extractedName) {
                const cmdMatch2 = code.match(/handler\.command\s*=\s*\[['"`]([^'"`]+)['"`]/);
                if (cmdMatch2) extractedName = cmdMatch2[1].trim();
            }
            
            if (!extractedName) {
                const fileMatch = code.match(/\/\/\s*(?:plugins|commands)\/([a-zA-Z0-9_\u0600-\u06FF-]+)\.js/);
                if (fileMatch) extractedName = fileMatch[1].trim();
            }
            
            if (!extractedName) {
                extractedName = `plugin_${Date.now().toString(36)}`;
            }
            
            fileName = `${extractedName}.js`;
        }

        const savePath = path.join(pluginsDir, fileName);
        const isEdit = fs.existsSync(savePath);
        fs.writeFileSync(savePath, code, "utf-8");

        const fileSize = (code.length / 1024).toFixed(2);
        const lineCount = code.split('\n').length;

        await react("✅");
        return m.reply(theme.build([
            { type: 'title', text: isEdit ? '✏️ ᏌᏒ - تـم الـتـعـديـل' : '✅ ᏌᏒ - تـم الإضـافـة' },
            { type: 'divider' },
            { type: 'info', label: '📄 الملف', value: fileName },
            { type: 'info', label: '📦 الحجم', value: `${fileSize} KB` },
            { type: 'info', label: '📝 الأسطر', value: `${lineCount} سطر` }
        ]));
    }

    // القائمة الافتراضية
    await react("📦");
    return m.reply(theme.build([
        { type: 'title', text: '📦 ᏌᏒ - إدارة الـبـلـوقـنـات' },
        { type: 'divider' },
        { type: 'info', label: '📄 باتش', value: 'عرض كود بلوجن' },
        { type: 'info', label: '🗑️ احذف', value: 'حذف بلوجن' },
        { type: 'info', label: '📋 لست', value: 'قائمة كل البلوقنات' },
        { type: 'info', label: '➕ ضيف', value: 'إضافة بلوجن جديد' }
    ]));
};

handler.help = ["بلوقن", "باتش", "احذف", "لست", "ضيف"];
handler.tags = ["owner"];
handler.command = /^(بلوقن|plugin|plugins|باتش|احذف|لست|ضيف)$/i;
handler.owner = true;

export default handler;
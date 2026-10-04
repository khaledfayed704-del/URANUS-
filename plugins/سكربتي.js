// plugins/getbot.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - نسخه احتياطيه للبوت 📦

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import { theme } from '../System/theme.js';
import { ButtonV2 } from '../System/NIXCODE.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// قائمة الاستثناءات الأساسية (دايمًا مستثناة بغض النظر عن الخيار)
const BASE_IGNORE = [
    '.npm/**',
    'JadiBots/**',
    'GataJadiBot/**',
    'tmp/**',
    '*.zip',
    '.git/**',
    'auth_info_baileys/**',
    'session/**'
];

async function buildAndSendZip(conn, m, withLibs, withDb = true) {
    const botFolderPath = path.join(__dirname, '../');
    const zipFilePath = path.join(__dirname, `../bot_files_${withLibs ? 'with' : 'without'}_libs_${withDb ? 'with' : 'without'}_db.zip`);

    try {
        if (!fs.existsSync(botFolderPath)) {
            await conn.sendMessage(m.chat, {
                text: theme.build([
                    { type: 'title', text: '❌ خـطـأ' },
                    { type: 'error', text: 'مجلد البوت غير موجود' },
                    { type: 'divider' },
                    { type: 'info', label: 'المسار', value: botFolderPath }
                ])
            }, { quoted: m });
            return;
        }

        let initialMessage = await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '📦 نـسـخـة احـتـيـاطـيـة' },
                { type: 'divider' },
                { type: 'line', text: `📂 جاري قراءة ملفات البوت (${withLibs ? 'مع' : 'من غير'} المكتبات، ${withDb ? 'مع' : 'من غير'} الداتا بيز)...` }
            ])
        }, { quoted: m });

        if (fs.existsSync(zipFilePath)) {
            try { fs.unlinkSync(zipFilePath); } catch {}
        }

        let zippingMessage = await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '🔄 جـاري الـضـغـط' },
                { type: 'divider' },
                { type: 'line', text: '⏳ يتم الآن إنشاء ملف ZIP...' }
            ]),
            edit: initialMessage.key
        }, { quoted: m });

        const ignoreList = [...BASE_IGNORE];
        if (!withLibs) ignoreList.push('node_modules/**');
        if (!withDb) ignoreList.push('database/**');

        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
                resolve(sizeMB);
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            archive.glob('**/*', {
                cwd: botFolderPath,
                ignore: ignoreList
            });

            archive.finalize();
        }).then(async (sizeMB) => {
            let sendingMessage = await conn.sendMessage(m.chat, {
                text: theme.build([
                    { type: 'title', text: '📤 جـاري الإرسـال' },
                    { type: 'success', text: 'تم إنشاء ملف ZIP بنجاح' },
                    { type: 'info', label: '📁 الحجم', value: `${sizeMB} MB` },
                    { type: 'info', label: '📚 المكتبات', value: withLibs ? 'متضمّنة' : 'غير متضمّنة' },
                    { type: 'info', label: '🗄️ الداتا بيز', value: withDb ? 'متضمّنة' : 'غير متضمّنة' },
                    { type: 'divider' },
                    { type: 'line', text: '⏳ يتم الآن إرسال الملف...' }
                ]),
                edit: zippingMessage.key
            }, { quoted: m });

            try {
                await conn.sendMessage(m.chat, {
                    document: fs.readFileSync(zipFilePath),
                    mimetype: 'application/zip',
                    fileName: `✧ 𝟐𝐁 - LynoX bot (${withLibs ? 'مع' : 'بدون'} المكتبات، ${withDb ? 'مع' : 'بدون'} الداتا بيز).zip`
                }, { quoted: m });

                fs.unlink(zipFilePath, async (err) => {
                    if (!err) {
                        await conn.sendMessage(m.chat, {
                            text: theme.build([
                                { type: 'title', text: '✅ تـم بـنـجـاح' },
                                { type: 'success', text: 'تم إرسال النسخة الاحتياطية وحذف الملف المؤقت' }
                            ]),
                            edit: sendingMessage.key
                        }, { quoted: m });
                    }
                });
            } catch (sendErr) {
                await conn.sendMessage(m.chat, {
                    text: theme.build([
                        { type: 'title', text: '❌ فـشـل الإرسـال' },
                        { type: 'error', text: sendErr.message },
                        { type: 'divider' },
                        { type: 'info', label: '💡 الحل', value: 'الملف كبير جداً' }
                    ]),
                    edit: sendingMessage.key
                }, { quoted: m });

                try { fs.unlinkSync(zipFilePath); } catch {}
            }
        }).catch(async (err) => {
            console.error('Archiver Error:', err);
            await conn.sendMessage(m.chat, {
                text: theme.build([
                    { type: 'title', text: '❌ فـشـل الـضـغـط' },
                    { type: 'error', text: err.message }
                ]),
                edit: zippingMessage.key
            }, { quoted: m });
        });

    } catch (err) {
        console.error('General Error:', err);
        await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '❌ خـطـأ غـيـر مـتـوقـع' },
                { type: 'error', text: err.message }
            ])
        }, { quoted: m });
    }
}

const handler = async (m, { conn, isOwner }) => {
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

    if (!isOwner) {
        await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '🔒 صـلاحـيـة مـرفـوضـة' },
                { type: 'subtitle', text: ' 🪐 هذا الأمر للمطور الحقيقي فقط' }
            ])
        }, { quoted: m });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '📦', key: m.key } });

    await new ButtonV2(conn)
        .setBody('📦 *نسخة احتياطية للبوت*\n\nاختر نوع النسخة اللي عايزها 👇')
        .setFooter(global.watermark || '🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ')
        .setThumbnail('https://files.catbox.moe/3vlgrf.jpg')
        .addButton('📚 ◂◄ مع المكتبات (node_modules) ►▸', '.سكربتي_تحميل مع')
        .addButton('🪶 ◂◄ من غير المكتبات ►▸', '.سكربتي_تحميل بدون')
        .addButton('🧹 ◂◄ من غير المكتبات والداتا بيز ►▸', '.سكربتي_تحميل بدون_كله')
        .send(m.chat, { quoted: m });
};

// ===== معالجة اختيار الزر =====
handler.before = async (m, { conn, isOwner }) => {
    const text = (m.text || '').trim();
    if (!text.startsWith('.سكربتي_تحميل ')) return;

    if (!isOwner) {
        await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '🔒 صـلاحـيـة مـرفـوضـة' },
                { type: 'subtitle', text: ' 🪐 هذا الأمر للمطور الحقيقي فقط' }
            ])
        }, { quoted: m });
        return true;
    }

    const choice = text.split(/\s+/)[1];

    if (choice === 'مع') {
        await buildAndSendZip(conn, m, true, true);
    } else if (choice === 'بدون_كله') {
        await buildAndSendZip(conn, m, false, false);
    } else {
        await buildAndSendZip(conn, m, false, true);
    }
    return true;
};

handler.help = ['سكربتي'];
handler.tags = ['owner'];
handler.command = /^(سكربتي|getbot|نسخه)$/i;
handler.owner = true;

export default handler;
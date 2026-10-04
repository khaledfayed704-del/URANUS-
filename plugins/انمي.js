// plugins/anime_smart.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - تحميل أنمي ذكي 🎬

import { Scrapy } from "meowsab";
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys';
import { theme } from '../System/theme.js';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// ═══════════════════════════════════════════════════════════════
// 🧠 الدالة الذكية - تستخرج الرابط المباشر من أي موقع
// ═══════════════════════════════════════════════════════════════

async function extractDirectUrl(url) {
    if (url.match(/\.(mp4|mkv|avi|mov|webm)(\?|$)/i)) {
        return url;
    }
    
    if (url.includes('mediafire.com')) {
        return await extractMediaFire(url);
    }
    
    if (url.includes('mp4upload.com')) {
        return await extractMP4Upload(url);
    }
    
    if (url.includes('uqload.com') || url.includes('uqload.is')) {
        return await extractUqload(url);
    }
    
    if (url.includes('vidmoly')) {
        return await extractVidMoly(url);
    }
    
    if (url.includes('gofile.io')) {
        return await extractGofile(url);
    }
    
    return await extractGeneric(url);
}

async function extractMediaFire(url) {
    try {
        let res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        let html = await res.text();
        let $ = cheerio.load(html);
        
        let directUrl = $('a[aria-label="Download file"]').attr('href');
        if (!directUrl) directUrl = $('#downloadButton').attr('href');
        if (!directUrl) directUrl = $('.download-link').attr('href');
        
        return directUrl;
    } catch {
        return null;
    }
}

async function extractMP4Upload(url) {
    try {
        let id = url.match(/embed-([^.]+)/)?.[1];
        if (!id) return null;
        
        let apiUrl = `https://www.mp4upload.com/api/file/info?id=${id}`;
        let res = await fetch(apiUrl);
        let data = await res.json();
        
        if (data.file?.url) return data.file.url;
        return null;
    } catch {
        return null;
    }
}

async function extractUqload(url) {
    try {
        let res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        let html = await res.text();
        let match = html.match(/file\s*:\s*["']([^"']+\.mp4[^"']*)["']/i);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

async function extractVidMoly(url) {
    try {
        let res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        let html = await res.text();
        let match = html.match(/file:\s*["']([^"']+)["']/i);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

async function extractGofile(url) {
    try {
        let code = url.split('/').pop();
        let apiUrl = `https://api.gofile.io/contents/${code}`;
        let res = await fetch(apiUrl);
        let data = await res.json();
        
        if (data.status === 'ok' && data.data?.contents) {
            let firstFile = Object.values(data.data.contents)[0];
            return firstFile?.link || null;
        }
        return null;
    } catch {
        return null;
    }
}

async function extractGeneric(url) {
    try {
        let res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        let html = await res.text();
        let match = html.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/i);
        return match ? match[0] : null;
    } catch {
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════
// 📥 دالة تحميل وإرسال الفيديو
// ═══════════════════════════════════════════════════════════════

async function downloadAndSend(m, conn, videoUrl, animeTitle, episodeTitle) {
    await m.react('⏳');
    
    try {
        let directUrl = await extractDirectUrl(videoUrl);
        if (!directUrl) {
            throw new Error('لا يمكن استخراج رابط التحميل');
        }
        
        let res = await fetch(directUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': videoUrl
            }
        });
        
        let buffer = await res.buffer();
        let sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        
        await conn.sendMessage(m.chat, {
            video: buffer,
            caption: theme.build([
                { type: 'title', text: `📺 ${animeTitle}` },
                { type: 'subtitle', text: episodeTitle },
                { type: 'info', label: '📁 الحجم', value: `${sizeMB} MB` },
                { type: 'success', text: '✅ تم التحميل' }
            ]),
            mimetype: 'video/mp4'
        });
        
        await m.react('✅');
        
    } catch (err) {
        console.error(err);
        await m.react('❌');
        await conn.sendMessage(m.chat, {
            text: theme.build([
                { type: 'title', text: '❌ فـشـل الـتـحـمـيـل' },
                { type: 'divider' },
                { type: 'line', text: '📥 رابط التحميل (افتحه في المتصفح):' },
                { type: 'line', text: videoUrl }
            ])
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎬 الأمر الرئيسي
// ═══════════════════════════════════════════════════════════════

let handler = async (m, { conn, text, usedPrefix, command }) => {
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

    
    // معالج التحميل المباشر
    if (text && (text.includes('http') || text.includes('mediafire') || text.includes('mp4upload'))) {
        await m.react('⏳');
        
        try {
            let directUrl = await extractDirectUrl(text);
            if (!directUrl) throw new Error('لا يوجد رابط تحميل');
            
            let res = await fetch(directUrl);
            let buffer = await res.buffer();
            let sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
            
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: theme.build([
                    { type: 'title', text: '✅ تـم الـتـحـمـيـل' },
                    { type: 'info', label: '📁 الحجم', value: `${sizeMB} MB` }
                ]),
                mimetype: 'video/mp4'
            });
            
            await m.react('✅');
            
        } catch (err) {
            await m.react('❌');
            m.reply(theme.build([
                { type: 'title', text: '❌ فـشـل الـتـحـمـيـل' },
                { type: 'error', text: err.message }
            ]));
        }
        return;
    }
    
    // معالج اختيار الحلقة
    if (text && text.startsWith('ep_')) {
        let parts = text.split('_');
        let animeId = parts[1];
        let animeTitle = decodeURIComponent(parts[2]);
        let episodeNum = parts[3];
        let episodeName = decodeURIComponent(parts.slice(4).join('_'));
        
        await m.react('⏳');
        
        try {
            const anime = await Scrapy.Witanime({ query: animeId, choose: "id" });
            const episode = anime.data.episodes.find(ep => ep.episode_number == episodeNum);
            
            if (!episode || !episode.download_links || episode.download_links.length === 0) {
                throw new Error('لا توجد روابط');
            }
            
            let bestLink = episode.download_links.find(l => 
                l.quality?.toLowerCase().includes('480') || 
                l.quality?.toLowerCase().includes('sd')
            );
            if (!bestLink) bestLink = episode.download_links[0];
            
            await downloadAndSend(m, conn, bestLink.url, animeTitle, episode.name);
            
        } catch (err) {
            await m.react('❌');
            m.reply(`❌ خطأ: ${err.message}`);
        }
        return;
    }
    
    // معالج اختيار الأنمي وعرض الحلقات
    if (text && text.startsWith('anime_')) {
        let parts = text.split('_');
        let animeId = parts[1];
        let animeTitle = decodeURIComponent(parts[2]);
        
        await m.react('⏳');
        
        try {
            const anime = await Scrapy.Witanime({ query: animeId, choose: "id" });
            const data = anime.data;
            
            if (!data || !data.episodes) {
                throw new Error('لا توجد حلقات');
            }
            
            let imgMsg = null;
            if (data.poster) {
                try {
                    imgMsg = await prepareWAMessageMedia(
                        { image: { url: data.poster } },
                        { upload: conn.waUploadToServer }
                    );
                } catch (err) {}
            }
            
            let rows = [];
            for (let ep of data.episodes.slice(0, 20)) {
                if (ep.download_links && ep.download_links.length > 0) {
                    rows.push({
                        title: `${ep.episode_number}. ${ep.name.substring(0, 40)}`,
                        description: `📅 ${ep.air_date || 'متوفرة'}`,
                        id: `${usedPrefix}${command} ep_${animeId}_${encodeURIComponent(animeTitle)}_${ep.episode_number}_${encodeURIComponent(ep.name)}`
                    });
                }
            }
            
            if (rows.length === 0) {
                throw new Error('لا توجد روابط متاحة');
            }
            
            const interactiveMessage = {
                body: { 
                    text: theme.build([
                        { type: 'title', text: `🎬 ${data.name}` },
                        { type: 'divider' },
                        { type: 'info', label: '⭐ التقييم', value: data.rating },
                        { type: 'info', label: '👁️ المشاهدات', value: data.views?.toLocaleString() },
                        { type: 'info', label: '📅', value: data.first_air_date },
                        { type: 'info', label: '🎭', value: data.genres?.join(", ") || "غير محدد" },
                        { type: 'divider' },
                        { type: 'line', text: (data.overview || '').slice(0, 200) + '...' }
                    ])
                },
                footer: { text: '✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧' },
                header: {
                    hasMediaAttachment: !!imgMsg?.imageMessage,
                    imageMessage: imgMsg?.imageMessage || null
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'single_select',
                            buttonParamsJson: JSON.stringify({
                                title: "🎬 اختر الحلقة",
                                sections: [{ title: `📺 ${data.name} (${data.episodes.length} حلقة)`, rows }]
                            })
                        }
                    ],
                    messageParamsJson: ""
                }
            };
            
            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: { message: { interactiveMessage } }
            }, { userJid: conn.user.jid, quoted: m });
            
            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            await m.react('✅');
            
        } catch (err) {
            await m.react('❌');
            m.reply(`❌ خطأ: ${err.message}`);
        }
        return;
    }
    
    // البحث عن أنمي
    if (!text) {
        return m.reply(theme.build([
            { type: 'title', text: '🎬 نـظـام تـحـمـيـل الأنـمـي' },
            { type: 'subtitle', text: 'ابحث عن أي أنمي وحمّل حلقاته' },
            { type: 'divider' },
            { type: 'info', label: '🔍 البحث', value: `${usedPrefix}${command} <اسم الأنمي>` },
            { type: 'spacer' },
            { type: 'info', label: '📥 تحميل مباشر', value: `${usedPrefix}${command} <رابط الفيديو>` },
            { type: 'spacer' },
            { type: 'info', label: '📝 أمثلة', value: '' },
            { type: 'line', text: `${usedPrefix}${command} بليتش` },
            { type: 'line', text: `${usedPrefix}${command} https://www.mediafire.com/file/xxx.mp4` }
        ]));
    }
    
    await m.react('⏳');
    
    try {
        const searchResult = await Scrapy.Witanime({ query: text, choose: "search" });
        const results = searchResult.data;
        
        if (!results || results.length === 0) {
            await m.react('❌');
            return m.reply(`❌ لا توجد نتائج للبحث: ${text}`);
        }
        
        let imgMsg = null;
        if (results[0]?.poster) {
            try {
                imgMsg = await prepareWAMessageMedia(
                    { image: { url: results[0].poster } },
                    { upload: conn.waUploadToServer }
                );
            } catch (err) {}
        }
        
        let rows = results.slice(0, 10).map(anime => ({
            title: anime.name.substring(0, 45),
            description: `⭐ ${anime.rating} | 👁️ ${anime.views?.toLocaleString()} | 📅 ${anime.release_date || '?'}`,
            id: `${usedPrefix}${command} anime_${anime.id}_${encodeURIComponent(anime.name)}`
        }));
        
        const interactiveMessage = {
            body: { 
                text: theme.build([
                    { type: 'title', text: '🔍 نـتـائـج الـبـحـث' },
                    { type: 'info', label: 'البحث', value: text },
                    { type: 'divider' },
                    { type: 'line', text: '📋 اختر الأنمي من القائمة:' }
                ])
            },
            footer: { text: '✧ 🪐 𝒰ℛ𝒜𝒩𝒰𝒮_ℬ𝒪𝒯 ✧' },
            header: {
                hasMediaAttachment: !!imgMsg?.imageMessage,
                imageMessage: imgMsg?.imageMessage || null
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: "🎬 اختر الأنمي",
                            sections: [{ title: "📺 نتائج البحث", rows }]
                        })
                    }
                ],
                messageParamsJson: ""
            }
        };
        
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: { message: { interactiveMessage } }
        }, { userJid: conn.user.jid, quoted: m });
        
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await m.react('✅');
        
    } catch (err) {
        await m.react('❌');
        m.reply(`❌ خطأ: ${err.message}`);
    }
};

handler.help = ['انمي <اسم>'];
handler.tags = ['anime'];
handler.command = /^(انمي)$/i;

export default handler;
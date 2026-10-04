// plugins/instagram.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - Instagram Downloader 📸

import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { tmpdir } from 'os'
import { existsSync, unlinkSync, statSync, chmodSync } from 'fs'
import os from 'os'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const execAsync = promisify(exec)

let ytDlpPath = null
let isInstalling = false
let installPromise = null

function getPlatform() {
    const arch = os.arch()
    const platform = os.platform()
    
    const archMap = {
        'x64': 'amd64', 'x86_64': 'amd64', 'amd64': 'amd64',
        'arm64': 'arm64', 'aarch64': 'arm64',
        'armv7l': 'armv7l', 'armv6l': 'armv6l',
        'i386': 'i386', 'i686': 'i386', 'x86': 'i386'
    }
    
    return {
        arch: archMap[arch] || 'amd64',
        platform: platform === 'win32' ? 'windows' : platform === 'darwin' ? 'macos' : 'linux'
    }
}

async function autoInstallYTDLP(conn, chat) {
    if (isInstalling && installPromise) return installPromise
    
    const { arch, platform } = getPlatform()
    const outputPath = join(process.cwd(), 'yt-dlp')
    
    if (existsSync(outputPath)) {
        try {
            await execAsync(`"${outputPath}" --version`, { timeout: 5000 })
            return outputPath
        } catch {}
    }
    
    isInstalling = true
    
    installPromise = (async () => {
        try {
            await conn.sendMessage(chat, { 
                text: '📦 *ᏌᏒ: "المكتبة مش موجودة، جاري التحميل..."*\n\n⏳ *يرجى الانتظار...*'
            })
            
            try {
                await conn.sendMessage(chat, { 
                    text: `📥 *ᏌᏒ تحمل المكتبة...*\n\n🖥️ *النظام:* ${platform}\n🔧 *المعالج:* ${arch}\n📡 *جاري التحميل من GitHub...*`
                })
                
                const urls = {
                    linux: {
                        amd64: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux',
                        arm64: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_aarch64',
                        armv7l: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_armv7l'
                    },
                    macos: { default: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos' },
                    windows: { default: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' }
                }
                
                const url = urls[platform]?.[arch] || urls[platform]?.default || 
                           `https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp${platform === 'windows' ? '.exe' : ''}`
                
                try { await execAsync(`rm -f "${outputPath}"`) } catch {}
                
                try {
                    await execAsync(`wget -q -O "${outputPath}" "${url}"`, { timeout: 120000 })
                } catch {
                    await execAsync(`curl -L -o "${outputPath}" "${url}"`, { timeout: 120000 })
                }
                
                if (existsSync(outputPath)) {
                    if (platform !== 'windows') chmodSync(outputPath, 0o755)
                    const size = (statSync(outputPath).size / 1048576).toFixed(2)
                    
                    await conn.sendMessage(chat, { 
                        text: `✅ *ᏌᏒ: "تم تحميل المكتبة!"*\n\n📦 *الحجم:* ${size} MB\n🔧 *المعالج:* ${arch}\n\n⚡ *جاري التحميل...*`
                    })
                    return outputPath
                }
            } catch {}
        } catch {}
        
        return null
    })().finally(() => {
        isInstalling = false
    })
    
    return installPromise
}

async function downloadInstagram(url, outputPath, conn, chat) {
    let bin = ytDlpPath
    
    if (!bin) {
        bin = await autoInstallYTDLP(conn, chat)
        if (!bin) throw new Error('فشل تحميل المكتبة - جرب:\npip install yt-dlp')
        ytDlpPath = bin
    }
    
    // ✅ استخدام exec بدل spawn للأوامر المركبة
    const cmd = `"${bin}" "${url}" -o "${outputPath}" -f "bestvideo+bestaudio/best" --merge-output-format mp4 --no-playlist --no-warnings`
    
    await execAsync(cmd, { timeout: 180000 })
    
    if (!existsSync(outputPath)) throw new Error('الملف مش موجود')
    return outputPath
}

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

    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
    }

    if (!text) {
        await react('❌')
        return m.reply(`📸 *ᏌᏒ - Instagram*\n\n⚔️ ${usedPrefix}${command} <رابط>`)
    }

    if (!text.includes('instagram.com') && !text.includes('instagr.am')) {
        await react('❌')
        return m.reply('❌ *ᏌᏒ: "الرابط مش من إنستقرام"*')
    }

    await react('⏳')
    let statusMsg = await m.reply('📸 *ᏌᏒ تحمل الفيديو...*')

    try {
        const outputPath = join(tmpdir(), `ig_${Date.now()}.mp4`)
        
        await downloadInstagram(text, outputPath, conn, m.chat)

        const fileSize = (statSync(outputPath).size / 1048576).toFixed(2)

        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }) } catch {}

        if (statSync(outputPath).size < 100 * 1048576) {
            await conn.sendMessage(m.chat, {
                video: { url: outputPath },
                caption: `✅ *ᏌᏒ - تم التحميل*\n📦 *الحجم:* ${fileSize} MB\n\n⚡ *LynoX bot*`
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, {
                document: { url: outputPath },
                mimetype: 'video/mp4',
                fileName: `instagram_${Date.now()}.mp4`,
                caption: `✅ *ᏌᏒ - تم التحميل*\n📦 *الحجم:* ${fileSize} MB`
            }, { quoted: m })
        }

        await react('✅')
        setTimeout(() => { try { unlinkSync(outputPath) } catch {} }, 5000)

    } catch (e) {
        console.error('[ᏌᏒ-IG]', e.message)
        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }) } catch {}
        await react('❌')
        m.reply(`❌ *ᏌᏒ: "فشل التحميل"*\n${e.message?.substring(0, 200)}`)
    }
}

handler.command = /^(انستا|انستقرام|ig|instagram)$/i
handler.help = ['انستا <رابط>']
handler.tags = ['downloader']

export default handler
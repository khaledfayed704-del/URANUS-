// plugins/kablod.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B — كابلود 🤖

import WebSocket from 'ws';
import axios from 'axios';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


class Copilot {
    constructor() {
        this.conversationId = null
        this.headers = {
            origin: 'https://copilot.microsoft.com',
            'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
        }
    }

    async createConversation() {
        let { data } = await axios.post('https://copilot.microsoft.com/c/api/conversations', null, { headers: this.headers })
        this.conversationId = data.id
        return this.conversationId
    }

    async chat(message) {
        if (!this.conversationId) await this.createConversation()
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`wss://copilot.microsoft.com/c/api/chat?api-version=2&features=-,ncedge,edgepagecontext&setflight=-,ncedge,edgepagecontext&ncedge=1`, { headers: this.headers })
            let response = ''
            
            const timeout = setTimeout(() => {
                ws.terminate()
                reject(new Error('الوقت انتهى، حاول مرة أخرى'))
            }, 60000)

            ws.on('open', () => {
                ws.send(JSON.stringify({
                    event: 'send',
                    mode: 'chat',
                    conversationId: this.conversationId,
                    content: [{ type: 'text', text: message }],
                    context: {}
                }))
            })

            ws.on('message', chunk => {
                try {
                    const parsed = JSON.parse(chunk.toString())
                    if (parsed.event === 'appendText') response += parsed.text || ''
                    if (parsed.event === 'done') {
                        clearTimeout(timeout)
                        resolve(response)
                        ws.close()
                    }
                } catch (e) {}
            })

            ws.on('error', (err) => {
                clearTimeout(timeout)
                reject(err)
            })
        })
    }
}

let handler = async (m, { conn, text }) => {
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
        if (!text) {
            return m.reply('>  🪐 *ᏌᏒ: "وحدة كابلود"*\n> \n> 🤖 *الاستخدام:* .كابلود <سؤالك>\n> 📌 *مثال:* .كابلود من أنت؟');
        }

        await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } });
        await m.reply('> 🧠 *ᏌᏒ: "كابلود يفكر..."*');

        let copilot = new Copilot();
        let res = await copilot.chat(text);

        if (!res || res.trim() === '') {
            throw new Error('لم يتم الحصول على رد');
        }

        let cleanResponse = res.trim();

        await conn.sendMessage(m.chat, {
            text: `>  🪐 *ᏌᏒ: "رد كابلود"*\n> \n> 💬 *سؤالك:* ${text}\n> \n> 📝 *الرد:*\n> ${cleanResponse}`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('[ᏌᏒ-Kablod]', e);
        await m.reply(`>  🪐 *ᏌᏒ: "خطأ"*\n> \n> 🤖 ${e.message || 'حدث خطأ في كابلود'}\n> 🔮 حاول مرة أخرى لاحقاً`);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
}

handler.help = ['كابلود <سؤال>'];
handler.command = ['كابلود', 'kablod'];
handler.tags = ['ai'];

export default handler;
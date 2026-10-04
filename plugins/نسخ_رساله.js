// plugins/copy-html.js
// ♡ Raiden Shogun - رسالة مع زرار نسخ 📋

import crypto from 'crypto'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


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

    const copyText = text || 'Copy me'
    
    await conn.relayMessage(m.chat, {
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify({
                            __typename: "GenAIUnifiedResponse",
                            response_id: `blabla-${Date.now()}`,
                            sections: [
                                {
                                    __typename: "GenAIUnifiedResponseSection",
                                    view_model: {
                                        __typename: "GenAIAddonActionLayoutViewModel",
                                        addon_action_type: "COPY_TO_CLIPBOARD",
                                        addon_action_alignment: "END",
                                        primitives: [
                                            {
                                                __typename: "GenAIMarkdownTextUXPrimitive",
                                                text: `\`${copyText}\``,
                                                inline_entities: []
                                            }
                                        ]
                                    }
                                }
                            ]
                        })).toString("base64")
                    },
                    contextInfo: {
                        isForwarded: true,
                        forwardOrigin: 4
                    }
                }
            }
        }
    })
}

handler.command = /^(نسخ_رساله|copy_msg)$/i
handler.rowner = true
handler.tags = ['tools']
export default handler
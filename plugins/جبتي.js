// ============================================================
// FILE: gpty.js - بوت جبتي (ChatGPT) بواجهة Meta AI
// ============================================================
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// بناء الرسالة HTML (تشبه ميتا وتقول ChatGPT)
const buildMetaHTML = (question, answer) => {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
html, body {
  margin: 0;
  padding: 0;
  background: #0a0a0a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #fff;
  text-align: center;
}
.container {
  max-width: 320px;
  margin: auto;
  padding: 10px;
  background: #1e1e1e;
  border-radius: 16px;
  border: 1px solid #333;
}
h3 {
  font-size: 14px;
  font-weight: 600;
  color: #888;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 5px 0 15px 0;
}
.question {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  text-align: left;
  color: #ccc;
  overflow-wrap: break-word;
}
.answer {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.7;
  text-align: left;
  color: #fff;
  overflow-wrap: break-word;
  max-height: 250px;
  overflow-y: auto;
}
.answer b {
  color: #4caf50;
}
.footer {
  font-size: 11px;
  color: #555;
  margin-top: 15px;
  letter-spacing: 1px;
}
</style>
</head>
<body>
<div class="container">
<h3>ChatGPT</h3>
<div class="question">سؤال: ${question}</div>
<div class="answer">${answer}</div>
<div class="footer">Powered by Monica</div>
</div>
</body>
</html>`;
};

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

    if (!text) return m.reply(`⚠️ يرجى كتابة سؤالك بعد الأمر.\nمثال: ${usedPrefix + command} من أنت؟`);

    await m.react('⚡');

    const API_URL = "https://api.monica.im/api/custom_bot/chat";
    
    // الهيدرز والكوكيز
    const headers = {
        "authority": "api.monica.im",
        "accept": "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://monica.im",
        "referer": "https://monica.im/",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
        "x-client-id": "ebfd66d3-106e-4f17-b0c8-66b3358d2854",
        "x-client-locale": "ar",
        "x-client-type": "web",
        "x-client-version": "5.4.3",
        "x-from-channel": "NA",
        "x-product-name": "Monica",
        "x-time-zone": "Africa/Casablanca;-60",
        "Cookie": "الكوكيز"
    };

    const conversation_id = `conv:${uuidv4()}`;
    const welcome_item_id = `msg:${uuidv4()}`;
    const question_item_id = `msg:${uuidv4()}`;
    const pre_generated_reply_id = `msg:${uuidv4()}`;

    // الـ Payload
    const payload = {
        "task_uid": `task:${uuidv4()}`,
        "bot_uid": "gpt_4_1_nano",
        "data": {
            "conversation_id": conversation_id,
            "items": [
                {
                    "item_id": welcome_item_id,
                    "conversation_id": conversation_id,
                    "item_type": "reply",
                    "summary": "__RENDER_BOT_WELCOME_MSG__",
                    "data": { "type": "text", "content": "__RENDER_BOT_WELCOME_MSG__" }
                },
                {
                    "conversation_id": conversation_id,
                    "item_id": question_item_id,
                    "item_type": "question",
                    "summary": text,
                    "parent_item_id": welcome_item_id,
                    "data": { "type": "text", "content": text, "quote_content": "", "max_token": 0, "is_incognito": false }
                }
            ],
            "pre_generated_reply_id": pre_generated_reply_id,
            "pre_parent_item_id": question_item_id,
            "origin": "https://monica.im/ar/products/ai-chat",
            "origin_page_title": "دردشة AI مجانية - افتح حصتك اليومية من المحادثات",
            "trigger_by": "auto",
            "use_model": "gpt-4.1-nano",
            "is_incognito": false,
            "use_new_memory": true,
            "use_memory_suggestion": true
        },
        "language": "auto",
        "locale": "ar",
        "task_type": "chat",
        "tool_data": { "sys_skill_list": [] },
        "ai_resp_language": "Arabic"
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        let fullText = "";
        
        // معالجة تدفق البيانات المباشر SSE
        response.body.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(6).trim();
                    if (!jsonStr) continue;
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.text) fullText += data.text;
                    } catch (e) {
                    }
                }
            }
        });

        response.body.on('end', async () => {
            const trimmedText = fullText.trim();
            if (trimmedText) {
                // إرسال الرسالة HTML بنفس شكل Meta AI
                await conn.relayMessage(
                    m.chat,
                    {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                            botMetadata: {
                                messageDisclaimerText: "",
                                botResponseId: "b2e40280-433c-45d8-9c1a-270bec558860",
                                verificationMetadata: {
                                    proofs: [
                                        {
                                            version: 1,
                                            useCase: 1,
                                            signature: "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==",
                                            certificateChain: [
                                                "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJᏌᏒt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4bᏌᏒdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kxᏌᏒxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg",
                                                "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ=="
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    botForwardedMessage: {
                        message: {
                            richResponseMessage: {
                                messageType: 1,
                                submessages: [
                                    {
                                        messageType: 2,
                                        messageText: "ChatGPT"
                                    }
                                ],
                                unifiedResponse: {
                                    data: Buffer.from(
                                        JSON.stringify({
                                            response_id: "uranos-gpt-ai",
                                            sections: [
                                                {
                                                    view_model: {
                                                        primitive: {
                                                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                                                            payload: buildMetaHTML(text, trimmedText),
                                                            trusted_sources: ["nixel.dev"]
                                                        },
                                                        __typename: "GenAISingleLayoutViewModel"
                                                    }
                                                }
                                            ]
                                        })
                                    ).toString('base64')
                                },
                                contextInfo: {
                                    forwardingScore: 1,
                                    isForwarded: true,
                                    forwardedAiBotMessageInfo: {
                                        botJid: "867051314767696@bot"
                                    },
                                    forwardOrigin: 4
                                }
                            }
                        }
                    }
                },
                {}
            );

            await m.react('✅');
        } else {
            m.reply("❌ عذراً، الرد الذي تم استلامه من موناكو فارغ. قد تحتاج لتحديث جلسة العمل (session_id).");
            await m.react('⚠️');
        }

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء محاولة الاتصال بخوادم GPT.");
        await m.react('❌');
    }
};

handler.help = ['جبتي'];
handler.tags = ['ai'];
handler.command = /^(جبتي|gpt|gpt4)$/i;

export default handler;
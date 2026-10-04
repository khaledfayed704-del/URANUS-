// ============================================================
// FILE: render.js - مشغل كود HTML/CSS/JS 🎨
// ============================================================

import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
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

    
    let inputCode = "";
    
    // التحقق من الرسالة أو الريبلاي
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    const isDocument = q.mtype === 'documentMessage' || mime.includes('document');
    const isImage = q.mtype === 'imageMessage' || mime.includes('image');
    const isVideo = q.mtype === 'videoMessage' || mime.includes('video');
    const isSticker = q.mtype === 'stickerMessage' || mime.includes('sticker');

    // إذا كانت الصورة
    if (isImage) {
      try {
        const buffer = typeof q.download === 'function' 
          ? await q.download() 
          : await conn.downloadMediaMessage(q);
        
        const base64 = buffer.toString('base64');
        const mimeType = mime || 'image/png';
        
        inputCode = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:10px}
img{max-width:100%;max-height:90vh;border-radius:10px;box-shadow:0 0 50px rgba(0,0,0,0.5)}
</style>
</head>
<body>
<img src="data:${mimeType};base64,${base64}">
</body>
</html>`;
      } catch (err) {
        return conn.reply(m.chat, '⚠️ حدث خطأ أثناء محاولة قراءة الصورة.', m);
      }
    }
    
    // إذا كان الفيديو
    else if (isVideo) {
      try {
        const buffer = typeof q.download === 'function' 
          ? await q.download() 
          : await conn.downloadMediaMessage(q);
        
        const base64 = buffer.toString('base64');
        const mimeType = mime || 'video/mp4';
        
        inputCode = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:10px}
video{max-width:100%;max-height:90vh;border-radius:10px;box-shadow:0 0 50px rgba(0,0,0,0.5)}
</style>
</head>
<body>
<video controls src="data:${mimeType};base64,${base64}"></video>
</body>
</html>`;
      } catch (err) {
        return conn.reply(m.chat, '⚠️ حدث خطأ أثناء محاولة قراءة الفيديو.', m);
      }
    }
    
    // إذا كان ملصق (ستيكر)
    else if (isSticker) {
      try {
        const buffer = typeof q.download === 'function' 
          ? await q.download() 
          : await conn.downloadMediaMessage(q);
        
        const base64 = buffer.toString('base64');
        let mimeType = 'image/webp';
        if (buffer.length > 0) {
          const header = buffer.toString('hex', 0, 4);
          if (header === '52494646') {
            const riffType = buffer.toString('ascii', 8, 12);
            if (riffType === 'WEBP') {
              mimeType = 'image/webp';
            } else if (riffType === 'GIF ') {
              mimeType = 'image/gif';
            }
          }
        }
        
        const isAnimated = mimeType === 'image/gif' || (buffer.length > 0 && buffer.toString('ascii', 8, 12) === 'WEBP' && buffer[20] === 0x01);
        
        inputCode = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:10px}
img{max-width:100%;max-height:90vh;border-radius:10px;box-shadow:0 0 50px rgba(0,0,0,0.5)}
</style>
</head>
<body>
<img src="data:${mimeType};base64,${base64}">
</body>
</html>`;
      } catch (err) {
        return conn.reply(m.chat, '⚠️ حدث خطأ أثناء محاولة قراءة الملصق.', m);
      }
    }
    
    // إذا كان ملف نصي
    else if (isDocument || /text|javascript|html|json/.test(mime)) {
      try {
        const buffer = typeof q.download === 'function' 
          ? await q.download() 
          : await conn.downloadMediaMessage(q);
        inputCode = buffer.toString('utf-8');
      } catch (err) {
        return conn.reply(m.chat, '⚠️ حدث خطأ أثناء محاولة قراءة الملف.', m);
      }
    } else {
      inputCode = (m.quoted && m.quoted.text) ? m.quoted.text : text;
    }

    if (!inputCode) {
      return conn.reply(m.chat, `🎨 *ريندر كود HTML/CSS/JS*\n\nاستخدم: ${usedPrefix}ريندر [الكود]\nأو ارفع ملف HTML وارسل .ريندر\nأو اعمل ريبلاي على:\n🖼️ صورة\n🎬 فيديو\n🏷️ ملصق (ستيكر)\n📝 كود`, m);
    }

    let htmlCode = "";

    // البحث عن كود HTML
    const fullHtml = inputCode.match(/(?:<!DOCTYPE html>\s*)?<html[\s\S]*<\/html>/i);
    const inBackticks = inputCode.match(/```([\s\S]*?[<{][\s\S]*?)```/i);
    const inBackticks2 = inputCode.match(/`([\s\S]*?[<{][\s\S]*?)`/i);
    const rawBlocks = inputCode.match(/(<(?:style|div|script|canvas|svg|h1|p|span|button|input|form|table|ul|ol|li|a|img|video|audio|section|article|header|footer|nav|main|aside)[\s\S]*<\/(?:style|div|script|canvas|svg|h1|p|span|button|input|form|table|ul|ol|li|a|img|video|audio|section|article|header|footer|nav|main|aside)>)/i);
    const anyHtml = inputCode.match(/(<[a-zA-Z][^>]*>[\s\S]*?<\/[a-zA-Z][^>]*>)/i);
    const styleTag = inputCode.match(/(<style[\s\S]*<\/style>)/i);
    const scriptTag = inputCode.match(/(<script[\s\S]*<\/script>)/i);

    if (fullHtml) {
      htmlCode = fullHtml[0];
    } else if (inBackticks) {
      htmlCode = inBackticks[1];
    } else if (inBackticks2) {
      htmlCode = inBackticks2[1];
    } else if (rawBlocks) {
      htmlCode = rawBlocks[0];
    } else if (anyHtml) {
      htmlCode = anyHtml[0];
    } else if (styleTag || scriptTag) {
      htmlCode = (styleTag ? styleTag[0] : '') + (scriptTag ? scriptTag[0] : '');
    } else {
      htmlCode = `<div style="color:#fff;font-family:Arial;padding:20px;text-align:center;background:#1a1a1a;border-radius:10px;max-width:400px;margin:auto;">
  <h2 style="color:#ffd700;">📝 نص</h2>
  <p style="color:#ccc;font-size:14px;word-wrap:break-word;">${inputCode}</p>
</div>`;
    }

    // تغليف الكود إذا كان مجرد أجزاء
    if (!/<html/i.test(htmlCode)) {
      htmlCode = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:Arial,sans-serif;">
${htmlCode}
</body>
</html>`;
    }

    // إنشاء ID فريد
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    };

    // تجهيز البيانات
    const payloadJson = {
      response_id: generateUUID(),
      sections: [
        {
          view_model: {
            primitive: {
              __typename: "GenAIaeacdsnwHtmlPrimitive",
              payload: htmlCode,
              trusted_sources: ["nixel.dev"]
            },
            __typename: "GenAISingleLayoutViewModel"
          }
        }
      ]
    };

    const unifiedResponseData = Buffer.from(JSON.stringify(payloadJson)).toString('base64');

    // إرسال الرسالة
    await conn.relayMessage(
      m.chat,
      {
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🎨 Render"
                }
              ],
              unifiedResponse: {
                data: unifiedResponseData
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
      { quoted: m }
    );
};

handler.help = ['ريندر', 'render'];
handler.tags = ['tools'];
handler.command = /^(ريندر|render)$/i;

export default handler;
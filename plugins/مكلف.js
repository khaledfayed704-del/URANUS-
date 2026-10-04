// plugins/مكلف.js
// 🪐 ᏞᎩᏁᎾ᙭ 𝐁𝐎𝐓 - ذكاء متكلف لتطبيقات وألعاب HTML
// 🔮 المطور: ᏞᎩᏁᎾ᙭

import fs from "fs";
import path from "path";
import axios from "axios";
import { randomUUID } from "crypto";
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const BOT_NAME = "ᏞᎩᏁᎾ᙭ 𝐁𝐎𝐓";
const DEV_NAME = "ᏞᎩᏁᎾ᙭";
const CONTEXT_FILES = ["index.js", "handler.js", "settings.js"];

const FRAME_WIDTH = 320;
const FRAME_HEIGHT = 500;
const GAME_WIDTH = 280;
const GAME_HEIGHT = 440;

const SEARCH_ENGINE = "https://www.google.com/search?q=";

const CACHE_DIR = path.join(process.cwd(), "cache", "uranus_apps");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

/* ─────────────────────────────── 💾 حفظ/تحميل آخر لعبة ─────────────────────────────── */
function saveLastApp(chatId, title, html, raw) {
    try {
        const safeId = String(chatId).replace(/[^\w]/g, "_");
        const file = path.join(CACHE_DIR, `${safeId}.json`);
        fs.writeFileSync(file, JSON.stringify({
            title,
            html,
            raw: raw ? raw.slice(0, 200000) : "",
            savedAt: Date.now()
        }, null, 2), "utf-8");
    } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-SAVE-APP]", e.message); }
}

function loadLastApp(chatId) {
    try {
        const safeId = String(chatId).replace(/[^\w]/g, "_");
        const file = path.join(CACHE_DIR, `${safeId}.json`);
        if (!fs.existsSync(file)) return null;
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-LOAD-APP]", e.message); return null; }
}

/* ─────────────────────────────── 🌌 Gemini API ─────────────────────────────── */
async function gemini(input = {}) {
    const payload = typeof input === "string" ? { message: input } : input || {};
    const { message, instruction = "" } = payload;
    if (!message) throw new Error("Message is required.");

    const { headers } = await axios.post(
        "https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c",
        "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
        { headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" } }
    );
    const cookie = headers["set-cookie"]?.[0]?.split("; ")[0] || "";

    const requestBody = [
        [message, 0, null, null, null, null, 0],
        ["en-US"],
        ["", "", "", null, null, null, null, null, null, ""],
        null, null, null, [1], 1, null, null, 1, 0, null, null, null, null, null, [[0]], 1, null, null, null, null, null,
        ["", "", instruction, null, null, null, null, null, 0, null, 1, null, null, null, []],
        null, null, 1, null, null, null, null, null, null, null,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        1, null, null, null, null, [1]
    ];

    const { data } = await axios.post(
        "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c",
        new URLSearchParams({ "f.req": JSON.stringify([null, JSON.stringify(requestBody)]) }).toString(),
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "x-goog-ext-525001261-jspb": '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',
                cookie
            }
        }
    );

    const match = Array.from(String(data).matchAll(/^\d+\n(.+?)\n/gm));
    let parse1 = null;
    for (const item of match.reverse()) {
        const selectedArray = item?.[1];
        if (!selectedArray) continue;
        try {
            const realArray = JSON.parse(selectedArray);
            const candidate = realArray?.[0]?.[2];
            if (!candidate) continue;
            const parsed = JSON.parse(candidate);
            if (parsed?.[4]?.[0]?.[1]?.[0]) { parse1 = parsed; break; }
        } catch {}
    }
    if (!parse1) throw new Error("فشل تحليل رد Gemini.");
    return parse1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, "*$1*");
}

/* ─────────────────────────────── 📂 أدوات الملفات ─────────────────────────────── */
function resolveProjectFile(name) {
    const candidates = [
        path.join(process.cwd(), name),
        path.join(process.cwd(), "src", name),
        path.join(process.cwd(), "System", name),
        path.join(process.cwd(), "lib", name),
        path.join(process.cwd(), "config", name)
    ];
    return candidates.find(p => fs.existsSync(p)) || null;
}

function readProjectContext() {
    return CONTEXT_FILES.map(name => {
        const found = resolveProjectFile(name);
        if (!found) return `===== ${name} =====\n[غير موجود]`;
        let content = fs.readFileSync(found, "utf-8");
        if (content.length > 6000) content = content.slice(0, 6000) + "\n// truncated";
        return `===== ${name} =====\n${content}`;
    }).join("\n\n");
}

function extractJson(raw) {
    const cleaned = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    try { return JSON.parse(cleaned); } catch {}
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
        try { return JSON.parse(cleaned.slice(first, last + 1)); } catch {}
    }
    return null;
}

/* ─────────────────────────────── 🧹 استخراج الـ HTML الفعلي ─────────────────────────────── */
function extractCleanHtml(input) {
    if (!input) return "";
    let s = String(input).trim();

    // إزالة أسوار الماركداون
    s = s.replace(/```html/gi, "").replace(/```/g, "").trim();

    // لو جاي كنص JSON جوّه نص
    const jsonMatch = s.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            const j = JSON.parse(jsonMatch[0]);
            if (j.html) return String(j.html).trim();
        } catch {}
    }

    // التأكد إن فيه HTML فعلاً
    if (!/<[a-z][\s\S]*>/i.test(s)) return "";

    return s;
}

/* ─────────────────────────────── 🧹 تنظيف HTML نهائي ─────────────────────────────── */
function sanitizeHtml(html) {
    if (!html || typeof html !== "string") return html;
    let cleaned = html;

    cleaned = cleaned.replace(/```html/gi, "").replace(/```/g, "");
    cleaned = cleaned.replace(/position\s*:\s*fixed/gi, "position:absolute");
    cleaned = cleaned.replace(/overflow\s*:\s*visible/gi, "overflow:hidden");

    // تقييد الأبعاد
    cleaned = cleaned.replace(/width\s*:\s*(\d+(?:\.\d+)?)px/gi, (m, n) => {
        const p = parseFloat(n); return p > GAME_WIDTH ? `width:${GAME_WIDTH}px` : m;
    });
    cleaned = cleaned.replace(/height\s*:\s*(\d+(?:\.\d+)?)px/gi, (m, n) => {
        const p = parseFloat(n); return p > GAME_HEIGHT ? `height:${GAME_HEIGHT}px` : m;
    });

    return cleaned;
}

/* ─────────────────────────────── 🎨 الإطار ─────────────────────────────── */
function wrapWithFrame(html, fw = FRAME_WIDTH, fh = FRAME_HEIGHT, gw = GAME_WIDTH, gh = GAME_HEIGHT) {
    return `<meta name="viewport" content="width=${fw}, height=${fh}, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
  *,*::before,*::after{box-sizing:border-box !important;margin:0 !important;padding:0 !important;}
  html,body{
    width:${fw}px !important;height:${fh}px !important;
    overflow:hidden !important;background:#0a0906 !important;
    font-family:Tahoma,Arial,sans-serif !important;
    display:flex !important;align-items:center !important;justify-content:center !important;
  }
  #__frame__{
    width:${fw}px !important;height:${fh}px !important;
    display:flex !important;align-items:center !important;justify-content:center !important;
    background:radial-gradient(circle at 50% 40%,#1c1608 0%,#0a0906 70%);
    position:relative !important;overflow:hidden !important;border-radius:16px !important;
    border:1px solid rgba(250,204,21,.35) !important;
    box-shadow:0 0 25px rgba(250,204,21,.25) inset,0 0 40px rgba(234,179,8,.15) !important;
  }
  #__frame__::before{
    content:"🪐";position:absolute;top:6px;right:10px;font-size:16px;z-index:5;
    filter:drop-shadow(0 0 8px #facc15);
    animation:uf 4s ease-in-out infinite;
  }
  @keyframes uf{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px) rotate(15deg);}}
  #__game__{
    width:${gw}px !important;height:${gh}px !important;
    overflow:hidden !important;position:relative !important;
    border-radius:14px !important;
    box-shadow:0 0 20px rgba(250,204,21,.5) !important;
    border:1px solid rgba(250,204,21,.4) !important;
    background:#0a0906 !important;z-index:2 !important;
  }
  #__game__ > *{
    width:100% !important;height:100% !important;
    max-width:100% !important;max-height:100% !important;
    overflow:hidden !important;box-sizing:border-box !important;
    display:flex !important;flex-direction:column !important;
  }
  #__game__ img,#__game__ canvas,#__game__ svg{max-width:100% !important;max-height:100% !important;display:block !important;}
  #__game__ [style*="position:fixed"]{position:absolute !important;}
</style>
<div id="__frame__"><div id="__game__">${html}</div></div>`;
}

/* ─────────────────────────────── 💫 تطبيق افتراضي ─────────────────────────────── */
function fallbackApp(title) {
    return `<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{width:100%;height:100%;background:#0a0906;color:#fef3c7;font-family:Tahoma,Arial,sans-serif;
       display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:12px;}
  .card{width:100%;height:100%;padding:14px;border:1px solid #facc15;border-radius:14px;
        background:linear-gradient(180deg,#1c1608,#0a0906);display:flex;flex-direction:column;
        justify-content:space-between;box-shadow:0 0 18px rgba(250,204,21,.45);position:relative;overflow:hidden;}
  h1{color:#fde047;font-size:14px;text-shadow:0 0 10px #facc15;padding-left:32px;}
  p{font-size:11px;color:#fef9c3;opacity:.85;margin:2px 0;}
  button{width:100%;padding:8px;border:0;border-radius:10px;background:linear-gradient(135deg,#facc15,#ca8a04);
         color:#0a0906;font-weight:800;box-shadow:0 0 14px #facc15;font-size:12px;}
  #ib{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;padding:0;
      background:linear-gradient(135deg,#facc15,#ca8a04);color:#0a0906;font-weight:900;font-size:13px;
      box-shadow:0 0 10px #facc15;border:0;cursor:pointer;line-height:24px;text-align:center;}
  #ix{position:absolute;top:38px;right:8px;max-width:180px;background:rgba(10,9,6,.96);
      border:1px solid #facc15;border-radius:10px;padding:8px;font-size:10px;color:#fef9c3;
      line-height:1.5;box-shadow:0 0 14px rgba(250,204,21,.5);display:none;}
</style>
<div class="card">
  <button id="ib" onclick="document.getElementById('ix').style.display=document.getElementById('ix').style.display==='block'?'none':'block'">ℹ</button>
  <div id="ix">💠 ${title}<br>🔮 ${DEV_NAME}</div>
  <div>
    <h1>🪐 ${title}</h1>
    <p>اضغط الزر للتفاعل</p>
  </div>
  <button onclick="this.textContent='✅ تم!'">💠 اضغط</button>
</div>`;
}

/* ─────────────────────────────── 🚀 إرسال التطبيق ─────────────────────────────── */
async function sendHtmlApp(conn, chat, title, html) {
    const responseId = randomUUID();
    const safeHtml = sanitizeHtml(html);
    const framedHtml = wrapWithFrame(safeHtml, FRAME_WIDTH, FRAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

    await conn.relayMessage(chat, {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: { messageDisclaimerText: "", botResponseId: responseId }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [
                        {
                            messageType: 2,
                            messageText: `\n🪐 *${BOT_NAME}*\n💠 ${title}\n🔮 المطور: ${DEV_NAME}\n`
                        }
                    ],
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify({
                            __typename: "GenAIUnifiedResponse",
                            response_id: responseId,
                            sections: [{
                                __typename: "GenAIUnifiedResponseSection",
                                view_model: {
                                    __typename: "GenAISingleLayoutViewModel",
                                    width: FRAME_WIDTH,
                                    height: FRAME_HEIGHT,
                                    primitive: {
                                        __typename: "FOAHtmlPrimitiveDemoDONOTUSE",
                                        trusted_sources: ["uranus.dev", "whatsapp.com"],
                                        width: FRAME_WIDTH,
                                        height: FRAME_HEIGHT,
                                        payload: framedHtml
                                    }
                                }
                            }]
                        })).toString("base64")
                    },
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                        forwardOrigin: 4
                    }
                }
            }
        }
    }, { additionalAttributes: { type: "text" }, edit: false });
}

/* ─────────────────────────────── 📥 استخراج كود مرجعي ─────────────────────────────── */
function extractReferenceCode(text) {
    if (!text) return "";
    const codeBlock = text.match(/```(?:[\w-]*\n)?([\s\S]*?)```/);
    if (codeBlock && codeBlock[1].trim().length > 20) return codeBlock[1].trim();
    const afterCode = text.split(/(?:الكود|كود)\s*[:\-]?\s*/i);
    if (afterCode.length > 1 && afterCode[1].trim().length > 20) return afterCode[1].trim();
    return "";
}

/* ─────────────────────────────── 🧠 إعادة صياغة الطلب ─────────────────────────────── */
async function refineRequest(userQuery) {
    try {
        const refined = await gemini({
            message: `أعد صياغة الطلب التالي بشكل واضح ومختصر جداً (سطر أو سطرين فقط)، واذكر: نوع التطبيق/اللعبة، الوظائف المطلوبة، وأي API خارجي قد نحتاجه. لا تكتب كوداً، فقط وصف.\n\nالطلب:\n${userQuery}`,
            instruction: "أنت مساعد تقني. أعد صياغة الطلب بشكل مختصر وواضح. لا تكتب كوداً."
        });
        return refined.trim().slice(0, 500);
    } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-REFINE]", e.message); return userQuery; }
}

/* ─────────────────────────────── 🌐 البحث عن API ─────────────────────────────── */
async function searchForApi(query) {
    try {
        const suggestion = await gemini({
            message: `ابحث منطقياً واقترح أفضل API مجاني وموثوق (بدون مفتاح) لهذا الطلب: ${query}\n\nأرجع فقط اسم الـ API ورابطه ونقطة النهاية (endpoint) وطريقة الاستخدام المختصرة.`,
            instruction: "أنت خبير في APIs. اقترح أفضل API مجاني وموثوق. لا تكتب كوداً، فقط معلومات الـ API."
        });
        return suggestion.trim().slice(0, 500);
    } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-SEARCH]", e.message); return ""; }
}

/* ─────────────────────────────── 🎯 المعالج الرئيسي ─────────────────────────────── */
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

    let query = String(text || "").trim();

    /* ───────────── 📦 أمر فرعي: .مكلف كود ───────────── */
    if (/^(كود|code)$/i.test(query)) {
        const lastApp = loadLastApp(m.chat);
        if (!lastApp) {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
            return m.reply(
                `╭─❍ 🪐 *${BOT_NAME}* ❍─╮\n` +
                `│ ⚠ لا يوجد كود محفوظ\n` +
                `│ 💠 استخدم: ${usedPrefix}${command} سوي لعبة\n` +
                `│ 🔮 المطور: ${DEV_NAME}\n` +
                `╰──────────────────╯`
            );
        }

        await conn.sendMessage(m.chat, { react: { text: "📦", key: m.key } }).catch(() => {});
        await conn.sendPresenceUpdate("composing", m.chat).catch(() => {});

        const savedDate = new Date(lastApp.savedAt).toLocaleString("ar-EG");
        const codeText = lastApp.raw && lastApp.raw.includes("<") ? lastApp.raw : lastApp.html;

        const header =
            `╭─❍ 🪐 *${BOT_NAME}* ❍─╮\n` +
            `│ 📦 *آخر لعبة*\n` +
            `│ 💠 الاسم: ${lastApp.title}\n` +
            `│ 🕐 التاريخ: ${savedDate}\n` +
            `╰──────────────────╯\n\n`;

        if (codeText.length > 3500) {
            const buffer = Buffer.from(codeText, "utf-8");
            await conn.sendMessage(m.chat, {
                document: buffer,
                mimetype: "text/html",
                fileName: `${lastApp.title || "uranus_app"}.html`,
                caption: header + `📎 تم إرسال الكود في ملف HTML`
            }, { quoted: m });
        } else {
            await m.reply(header + "```html\n" + codeText + "\n```");
        }

        await conn.sendPresenceUpdate("available", m.chat).catch(() => {});
        return;
    }

    if (/^(help|مساعده|مساعدة)$/i.test(query)) {
        return m.reply(
            `╭─❍ 🪐 *${BOT_NAME}* ❍─╮\n` +
            `│ 💠 ذكاء متكلف لتطبيقات HTML\n` +
            `│ ✨ أمثلة:\n` +
            `│ > ${usedPrefix}${command} سوي لعبة ذاكرة\n` +
            `│ > ${usedPrefix}${command} كود\n` +
            `│ 🔮 المطور: ${DEV_NAME}\n` +
            `╰──────────────────╯`
        );
    }

    if (!query) query = "تطبيق تفاعلي فاخر";

    await conn.sendMessage(m.chat, { react: { text: "🪐", key: m.key } }).catch(() => {});
    await conn.sendPresenceUpdate("composing", m.chat).catch(() => {});

    const referenceCode = extractReferenceCode(query);
    const cleanQuery = referenceCode ? query.replace(referenceCode, "").trim() : query;

    let refinedQuery = cleanQuery;
    try { refinedQuery = await refineRequest(cleanQuery); } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-REFINE-FAIL]", e.message); }

    let apiSuggestion = "";
    const needsApi = /api|بحث|search|بيانات|data|تيك توك|tiktok|يوتيوب|youtube|طقس|weather|أخبار|news/i.test(cleanQuery);
    if (needsApi) { try { apiSuggestion = await searchForApi(cleanQuery); } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-SEARCH-FAIL]", e.message); } }

    let title = "تطبيق ᏞᎩᏁᎾ᙭";
    let html = fallbackApp(title);
    let raw = "";

    try {
        const projectContext = readProjectContext();

        const instruction =
            `أنت مصمم تطبيقات وألعاب HTML فاخر داخل ${BOT_NAME}. المطور ${DEV_NAME}. ` +

            `⚠️ قواعد إلزامية:\n` +
            `1) الحاوية ${GAME_WIDTH}px عرضاً و ${GAME_HEIGHT}px ارتفاعاً بالضبط.\n` +
            `2) ممنوع أي عنصر يخرج عن الحدود.\n` +
            `3) html, body {width:100%; height:100%; margin:0; padding:0; overflow:hidden;}\n` +
            `4) الجذر {width:100%; height:100%; display:flex; flex-direction:column; overflow:hidden;}\n` +
            `5) ممنوع position:fixed، ممنوع scroll، خطوط 10-14px.\n` +
            `6) الشبكات: width:100%; aspect-ratio:1/1; margin:0 auto;\n` +
            `7) مجموع العرض + padding + border ≤ 100%.\n` +

            `🎨 الثيم: خلفية #0a0906 + أصفر نيون #facc15 + أصفر #eab308 و #fde047 + glow. ممنوع الأزرق. عربي. تصميم فخم كوكب زحل.\n` +

            `🔴 زر ℹ إلزامي: دائري 24×24 أعلى يمين (top:8px; right:8px)، خلفية تدرج ذهبي، رمز ℹ، عند الضغط تظهر لوحة صغيرة (top:38px; right:8px) فيها شرح اللعبة + "🔮 ${DEV_NAME}"، وزر toggle.\n` +

            `⚠️ مهم جداً: أرجع JSON نظيف فقط بدون أي ``` أو شرح. شكل JSON:\n` +
            `{"title":"اسم اللعبة","html":"<style>...</style><div>...</div><script>...</script>"}\n` +
            `كل الـ HTML (style + div + script) يوضع داخل قيمة html كنص واحد Escape للاقتباسات " بـ \\" و newlines بـ \\n.\n` +

            `الطلب: ${cleanQuery}\n` +
            `المعاد صياغته: ${refinedQuery}\n` +
            (referenceCode ? `كود مرجعي:\n${referenceCode.slice(0, 8000)}\n` : "") +
            (apiSuggestion ? `API مقترح:\n${apiSuggestion}\n` : "") +
            `هيكل المشروع:\n${projectContext}`;

        raw = await gemini({
            message: `اصنع التطبيق/اللعبة:\n${instruction}`,
            instruction: "أرجع JSON خام فقط بدون أي شرح أو ```."
        });

        const parsed = extractJson(raw);
        if (parsed?.title) title = String(parsed.title).trim();
        if (parsed?.html) {
            const cleanHtml = extractCleanHtml(parsed.html);
            if (cleanHtml) html = cleanHtml;
        } else {
            // لو رجّع HTML مباشر بدون JSON
            const directHtml = extractCleanHtml(raw);
            if (directHtml) html = directHtml;
        }

        saveLastApp(m.chat, title, html, raw);
    } catch (e) { console.error("[ᏞᎩᏁᎾ᙭-MOKALLAF]", e.message); }

    try {
        await sendHtmlApp(conn, m.chat, title, html);
        await conn.sendMessage(m.chat, { react: { text: "🪐", key: m.key } }).catch(() => {});
    } catch (err) {
        console.error("[ᏞᎩᏁᎾ᙭-SEND]", err);
        await m.reply(
            `╭─❍ 🪐 *${BOT_NAME}* ❍─╮\n` +
            `│ 💠 فشل الإرسال\n` +
            `│ ✖ ${err.message || err}\n` +
            `╰──────────────────╯`
        );
    } finally {
        await conn.sendPresenceUpdate("available", m.chat).catch(() => {});
    }
};

handler.help = ["مكلف"];
handler.tags = ["ai", "game", "app"];
handler.command = /^(مكلف)$/i;
handler.description = "ذكاء متكلف يصنع تطبيقات وألعاب HTML داخل واتساب بثيم أورانوس 🪐";

export default handler;
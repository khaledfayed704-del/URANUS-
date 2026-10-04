// plugins/lynox.js
// 🐧 لينوكس LYNOX - مساعد Linux الذكي | مطور: خالد

import axios from "axios";
import fs from 'fs';
import path from 'path';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// ─── Gemini API (BardChatUi) ───
const geminiSessions = new Map();

async function gemini(input = {}) {
  const payload = typeof input === "string" ? { message: input } : input || {};
  const { message, instruction = "", sessionId = null } = payload;

  try {
    if (!message) throw new Error("Message is required.");

    let resumeArray = null;
    let cookie = null;
    let savedInstruction = instruction;

    if (sessionId) {
      try {
        const sessionData = JSON.parse(
          Buffer.from(sessionId, "base64").toString(),
        );
        resumeArray = sessionData.resumeArray;
        cookie = sessionData.cookie;
        savedInstruction = instruction || sessionData.instruction || "";
      } catch (e) {
        console.error("Error parsing session:", e.message);
      }
    }

    if (!cookie) {
      const { headers } = await axios.post(
        "https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c",
        "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        },
      );

      cookie = headers["set-cookie"]?.[0]?.split("; ")[0] || "";
    }

    const requestBody = [
      [message, 0, null, null, null, null, 0],
      ["en-US"],
      resumeArray || ["", "", "", null, null, null, null, null, null, ""],
      null,
      null,
      null,
      [1],
      1,
      null,
      null,
      1,
      0,
      null,
      null,
      null,
      null,
      null,
      [[0]],
      1,
      null,
      null,
      null,
      null,
      null,
      [
        "",
        "",
        savedInstruction,
        null,
        null,
        null,
        null,
        null,
        0,
        null,
        1,
        null,
        null,
        null,
        [],
      ],
      null,
      null,
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      1,
      null,
      null,
      null,
      null,
      [1],
    ];

    const payloadData = [null, JSON.stringify(requestBody)];

    const { data } = await axios.post(
      "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c",
      new URLSearchParams({ "f.req": JSON.stringify(payloadData) }).toString(),
      { 
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "x-goog-ext-525001261-jspb":
            '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',
          cookie: cookie,
        },
      },
    );

    const match = Array.from(data.matchAll(/^\d+\n(.+?)\n/gm));
    const array = match.reverse();
    let parse1 = null;

    for (const item of array) {
      const selectedArray = item?.[1];
      if (!selectedArray) continue;

      try {
        const realArray = JSON.parse(selectedArray);
        const candidate = realArray?.[0]?.[2];
        if (!candidate) continue;

        const parsed = JSON.parse(candidate);
        if (parsed?.[4]?.[0]?.[1]?.[0]) {
          parse1 = parsed;
          break;
        }
      } catch {}
    }

    if (!parse1) {
      throw new Error("فشل في تحليل رد Gemini.");
    }

    const newResumeArray = [...parse1[1], parse1[4][0][0]];
    const text = parse1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, "*$1*");

    const newSessionId = Buffer.from(
      JSON.stringify({
        resumeArray: newResumeArray,
        cookie: cookie,
        instruction: savedInstruction,
      }),
    ).toString("base64");

    return {
      text: text,
      sessionId: newSessionId,
    };
  } catch (error) {
    if (error?.response?.data) {
      const apiMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || error.response.data.error;
      if (apiMessage) {
        error.message = apiMessage;
      }
    }

    throw error;
  }
}

// ─── إعدادات إدارة البلاغنز ───
const PLUGINS_DIR = path.join(process.cwd(), 'plugins');
const DISABLED_SUFFIX = '.disable';

// ريأكشن سريع على رسالة المستخدم
const react = async (conn, m, emoji) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    } catch (e) {
        // بعض الأنظمة القديمة مش بتدعم الريأكشن
    }
};

// هل المرسل مالك/أدمن البوت؟
const isOwner = (m) => {
    try {
        if (m.fromMe) return true;
        const owners = Array.isArray(global.owner) ? global.owner : [];
        const normalized = owners.map(o => {
            const num = Array.isArray(o) ? o[0] : o;
            return String(num).replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        });
        return normalized.includes(m.sender);
    } catch {
        return false;
    }
};

// كل ملفات البلاغنز (شغالة + متعطلة)
const listPluginFiles = () => {
    if (!fs.existsSync(PLUGINS_DIR)) return [];
    return fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js') || f.endsWith(DISABLED_SUFFIX));
};

// دور على ملف بلاغن بالاسم
const findPluginFile = (name) => {
    const clean = name.trim().toLowerCase().replace(/\.js$/, '');
    const files = listPluginFiles();
    return files.find(f => f.toLowerCase().replace(DISABLED_SUFFIX, '').replace(/\.js$/, '').includes(clean));
};

const isDisabled = (filename) => filename.endsWith(DISABLED_SUFFIX);

// يبني رسالة عرض قائمة البلاغنز
const formatPluginList = () => {
    const files = listPluginFiles();
    if (!files.length) return '📂 مفيش أي بلاغنز في الفولدر دلوقتي.';

    const active = files.filter(f => !isDisabled(f)).sort();
    const disabled = files.filter(isDisabled).sort();

    let out = `📦 *البلاغنز المتاحة (${files.length}):*\n\n`;
    out += `✅ *شغالة (${active.length}):*\n`;
    out += active.length ? active.map(f => `• ${f}`).join('\n') : '—';
    out += `\n\n⛔ *متعطلة (${disabled.length}):*\n`;
    out += disabled.length ? disabled.map(f => `• ${f.replace(DISABLED_SUFFIX, '')}`).join('\n') : '—';
    return out;
};

let handler = async (m, { conn, text, args, command }) => {
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

    const input = (text || args.join(' ')).trim();
    const lower = input.toLowerCase();

    // ─── ردود مخصصة ───
    if (/اسمك|اسمك ايه|ما اسمك|من انت|مين انت|your name|who are you/i.test(lower)) {
        await react(conn, m, '🐧');
        return conn.sendMessage(m.chat, {
            text: '🐧 أنا *لينوكس LYNOX*، صاحبك في كل حاجة تخص Linux 😄\nاسألني في أي وقت، هساعدك بأقصى دقة ممكنة.'
        }, { quoted: m });
    }

    if (/مطور|صانع|مبرمج|من صنعك|من برمجك|who made you|developer|creator/i.test(lower)) {
        await react(conn, m, '👨‍💻');
        return conn.sendMessage(m.chat, {
            text: '👨‍💻 اللي كوّدني ودرّبني هو *خالد*، هو اللي مسؤول عن كل التحديثات اللي بتشوفها فيّا.'
        }, { quoted: m });
    }

    // ─── إدارة البلاغنز ───
    const showPlugins = /^(اعرض|عرض|قائمة|list)\s*(ال)?(بلاغنز|بلاغن|بلقن|plugins?)(\s|$)/i.test(lower.trim());
    const runPlugin = lower.match(/^(شغل|فعل|enable)\s+(ال)?(بلاغن|بلقن|plugin)\s+(.+)/i);
    const stopPlugin = lower.match(/^(عطل|امسح|احذف|شيل|disable|delete|remove)\s+(ال)?(بلاغن|بلقن|plugin)\s+(.+)/i);

    if (showPlugins) {
        await react(conn, m, '📦');
        return conn.sendMessage(m.chat, { text: formatPluginList() }, { quoted: m });
    }

    if (runPlugin) {
        const name = runPlugin[4];
        if (!isOwner(m)) {
            await react(conn, m, '🚫');
            return conn.sendMessage(m.chat, { text: '🚫 تفعيل البلاغنز متاح للمالك/الأدمن بس.' }, { quoted: m });
        }
        const found = findPluginFile(name);
        if (!found) {
            await react(conn, m, '❓');
            return conn.sendMessage(m.chat, { text: `❓ مش لاقي بلاغن اسمه "${name}".` }, { quoted: m });
        }
        if (!isDisabled(found)) {
            await react(conn, m, 'ℹ️');
            return conn.sendMessage(m.chat, { text: `ℹ️ البلاغن *${found}* شغال أصلاً.` }, { quoted: m });
        }
        try {
            const oldPath = path.join(PLUGINS_DIR, found);
            const newName = found.replace(DISABLED_SUFFIX, '');
            const newPath = path.join(PLUGINS_DIR, newName);
            fs.renameSync(oldPath, newPath);
            await react(conn, m, '✅');
            return conn.sendMessage(m.chat, { text: `✅ اتفعّل البلاغن *${newName}* تاني.` }, { quoted: m });
        } catch (e) {
            await react(conn, m, '❌');
            return conn.sendMessage(m.chat, { text: `❌ حصل خطأ وأنا بفعّل البلاغن:\n${e.message}` }, { quoted: m });
        }
    }

    if (stopPlugin) {
        const name = stopPlugin[4];
        if (!isOwner(m)) {
            await react(conn, m, '🚫');
            return conn.sendMessage(m.chat, { text: '🚫 تعطيل/حذف البلاغنز متاح للمالك/الأدمن بس.' }, { quoted: m });
        }
        const found = findPluginFile(name);
        if (!found) {
            await react(conn, m, '❓');
            return conn.sendMessage(m.chat, { text: `❓ مش لاقي بلاغن اسمه "${name}".` }, { quoted: m });
        }
        if (isDisabled(found)) {
            await react(conn, m, 'ℹ️');
            return conn.sendMessage(m.chat, { text: `ℹ️ البلاغن *${found.replace(DISABLED_SUFFIX, '')}* متعطل أصلاً.` }, { quoted: m });
        }
        if (found.toLowerCase().includes('lynox')) {
            await react(conn, m, '🚫');
            return conn.sendMessage(m.chat, { text: '🚫 مينفعش تعطّل بلاغن لينوكس نفسه من هنا 😅' }, { quoted: m });
        }
        try {
            const oldPath = path.join(PLUGINS_DIR, found);
            const newPath = path.join(PLUGINS_DIR, found + DISABLED_SUFFIX);
            fs.renameSync(oldPath, newPath);
            await react(conn, m, '✅');
            return conn.sendMessage(m.chat, {
                text: `⛔ اتعطل البلاغن *${found}*.\n(الملف اتعمله إعادة تسمية مش حذف نهائي، تقدر ترجّعه بـ "شغل البلاغن ${found.replace('.js', '')}")`
            }, { quoted: m });
        } catch (e) {
            await react(conn, m, '❌');
            return conn.sendMessage(m.chat, { text: `❌ حصل خطأ وأنا بعطّل البلاغن:\n${e.message}` }, { quoted: m });
        }
    }

    // ─── فحص السؤال ───
    if (!input) {
        await react(conn, m, '❓');
        return conn.sendMessage(m.chat, {
            text: `🐧 *لينوكس LYNOX - مساعد Linux*\n\n` +
                  `اكتب سؤالك وأنا هجاوبك بأسلوب واضح وعملي، زي:\n` +
                  `> .${command} إزاي أعرض الملفات المخفية؟\n\n` +
                  `أو اسألني عن اسمي أو مين مطوري 😉\n\n` +
                  `تقدر كمان تتحكم في البلاغنز:\n` +
                  `> .${command} اعرض البلاغنز\n` +
                  `> .${command} شغل البلاغن اسم_البلاغن\n` +
                  `> .${command} عطل البلاغن اسم_البلاغن`
        }, { quoted: m });
    }

    // ─── ريأكشن "بفكر" + مؤشر الكتابة ───
    await react(conn, m, '⏳');
    await conn.sendPresenceUpdate('composing', m.chat);

    try {
        const sessionId = geminiSessions.get(m.chat) || null;

        const instruction =
            'أنت "لينوكس LYNOX"، خبير Linux محترف وصاحب أسلوب طبيعي وودود في الشرح. ' +
            'قواعدك:\n' +
            '1) جاوب بالعربية الفصحى المبسطة أو العامية الخفيفة حسب أسلوب السائل، من غير تكلف.\n' +
            '2) كن دقيقًا 100%: لو مش متأكد من أمر أو نتيجة، قول ذلك صراحة بدل ما تخمن.\n' +
            '3) اشرح بشكل مختصر وعملي، وقسّم الإجابة لخطوات أو نقاط لو السؤال معقد.\n' +
            '4) لما تكتب أوامر Linux، حطها دايمًا في كود بلوك واضح وباستخدام أحدث الممارسات.\n' +
            '5) لو السؤال فيه لبس، اسأل توضيح بدل ما تفترض.\n' +
            '6) خليك ودود وقريب من المستخدم، من غير مبالغة أو حشو.\n' +
            'اسمك لينوكس LYNOX ومطورك خالد، اذكر ده بس لو اتسألت مباشرة.\n\n' +
            'مهم جدًا: رجّع ردك دايمًا بصيغة JSON خام بس، من غير أي نص أو Markdown حوله، بالشكل ده بالظبط:\n' +
            '{"emoji":"X","answer":"نص الإجابة هنا"}\n' +
            'حيث X هو إيموجي واحد فقط يعبّر عن موضوع الإجابة (مثلاً 💾 للملفات، 🔒 للصلاحيات/الأمان، ' +
            '⚙️ للأوامر العامة، 🌐 للشبكات، 📦 للحزم، 🖥️ للنظام/الأداء، 🐛 لحل مشكلة/تصحيح خطأ، 🤔 لو السؤال غامض). ' +
            'اختار الأنسب حسب المحتوى الفعلي مش عشوائي.';

        const result = await gemini({
            message: input,
            instruction: instruction,
            sessionId: sessionId
        });

        geminiSessions.set(m.chat, result.sessionId);

        let answer, emoji;
        try {
            const cleaned = result.text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            answer = parsed.answer?.trim();
            emoji = parsed.emoji?.trim();
        } catch {
            answer = result.text;
        }

        if (!answer) throw new Error('مقدرتش أفهم شكل الرد اللي رجع من الـ API.');
        if (!emoji) emoji = '🐧';

        await react(conn, m, emoji);
        await conn.sendMessage(m.chat, {
            text: `🐧 *لينوكس LYNOX:*\n\n${answer}`
        }, { quoted: m });

    } catch (err) {
        console.error('[LYNOX ERROR]', err);
        await react(conn, m, '❌');
        await conn.sendMessage(m.chat, {
            text: `❌ حصلت مشكلة وأنا بجهز الرد:\n${err.message}\n\nجرب تاني بعد شوية، أو اتأكد إن سؤالك واضح.`
        }, { quoted: m });
    } finally {
        await conn.sendPresenceUpdate('available', m.chat);
    }
};

handler.command = /^(لينوكس|lynox|linux|لينكس)$/i;
handler.tags = ['ai', 'linux'];
handler.help = ['لينوكس', 'lynox', 'linux'];
handler.description = 'مساعد Linux ذكي باستخدام Gemini API + تحكم في البلاغنز (عرض/تشغيل/تعطيل) عن طريق أوامر طبيعية';

export default handler;
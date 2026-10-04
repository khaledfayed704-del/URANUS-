// plugins/index/توثيق.js
import { spawn } from "child_process";
import { existsSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const BG_URL = "https://files.catbox.moe/6je8ja.jpg";
const CHANNEL = "ايدي القناة 4@newsletter";
const COUNT_FILE = "./tawtheeq-count.json";

// 🎨 لوحة ألوان
const ACCENT_CYAN  = "0x00E5FF"; // سماوي - العناصر الأساسية + NEXT
const ACCENT_GREEN = "0x00FFA3"; // أخضر نعناعي - ACTIVE
const ACCENT_RED   = "0xFF4D6D"; // وردي محمر - BANNED
const ACCENT_PURPLE= "0xB14BFF"; // بنفسجي (احتياطي)
const BRAND = "LYNOX";

function digits(v = "") { return String(v).replace(/[^0-9]/g, ""); }

function nextCount() {
    let n = 0;
    try { if (existsSync(COUNT_FILE)) n = JSON.parse(readFileSync(COUNT_FILE, "utf8")).n || 0; } catch {}
    n += 1;
    writeFileSync(COUNT_FILE, JSON.stringify({ n }));
    return n;
}

function splitNum(num) {
    let cc = "1";
    let rest = String(num || "");
    if (!rest) return { cc: "---", rest: "unknown", shown: "unknown" };
    if (rest.startsWith("222")) { cc = "222"; rest = rest.slice(3); }
    else if (rest.startsWith("212")) { cc = "212"; rest = rest.slice(3); }
    else if (rest.startsWith("966")) { cc = "966"; rest = rest.slice(3); }
    else if (rest.startsWith("971")) { cc = "971"; rest = rest.slice(3); }
    else if (rest.startsWith("20")) { cc = "20"; rest = rest.slice(2); }
    else if (rest.length > 9) { cc = rest.slice(0, rest.length - 9); rest = rest.slice(-9); }
    rest = rest.replace(/(\d{2,3})(?=\d)/g, "$1 ").trim();
    return { cc, rest, shown: "+" + cc + " " + rest };
}

function jidToNumber(jid = "") {
    const id = String(jid).split("@")[0].split(":")[0];
    if (/^\d{8,}$/.test(id)) return id;
    return "";
}

function wrapText(text, max = 28) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
        const next = cur ? cur + " " + w : w;
        if (next.length > max) { if (cur) lines.push(cur); cur = w; } else cur = next;
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 4);
}

function boldFont() {
    return [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "C:/Windows/Fonts/arialbi.ttf",
        "C:/Windows/Fonts/arialbd.ttf"
    ].find(existsSync);
}

function esc(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "’");
}

async function saveBg(path) {
    const res = await fetch(BG_URL);
    if (!res.ok) throw new Error("bg");
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
}

async function resolveTarget(conn, m, text) {
    const raw = String(text || "").trim();
    const mention = (m.mentionedJid || [])[0];
    if (mention) return { jid: mention, user: raw.replace(/^@/, "") || mention };
    if (m.quoted?.sender) return { jid: m.quoted.sender, user: raw.replace(/^@/, "") || "quoted" };

    const num = digits(raw);
    if (num.length >= 8) return { jid: num + "@s.whatsapp.net", user: num };

    const user = raw.replace(/^@/, "").replace(/\s+/g, "");
    if (!user) return null;

    if (m.isGroup) {
        try {
            const meta = await conn.groupMetadata(m.chat);
            const found = (meta.participants || []).find(p => {
                const name = String(p.name || p.notify || p.id || "").toLowerCase();
                return name.includes(user.toLowerCase()) || String(p.id).includes(user);
            });
            if (found?.id) return { jid: found.id, user };
        } catch {}
    }
    return { jid: user + "@s.whatsapp.net", user };
}

async function getPhone(conn, jid) {
    let phone = jidToNumber(jid);
    if (phone) return phone;
    try {
        if (conn.signalRepository?.lidMapping?.getPNForLID) {
            const pn = await conn.signalRepository.lidMapping.getPNForLID(jid);
            phone = jidToNumber(pn);
            if (phone) return phone;
        }
    } catch {}
    try {
        const [wa] = await conn.onWhatsApp(jid);
        phone = jidToNumber(wa?.jid || wa?.lid || "");
        if (phone) return phone;
    } catch {}
    return "";
}

/* ---------- Rounded corner (geq alpha) ---------- */
function hyp(a, b) { return `sqrt((${a})*(${a})+(${b})*(${b}))`; }

function roundedAlphaExpr(w, h, r, insideA = 255, outsideA = 0) {
    const xr = w - r, yr = h - r;
    const tl = `lte(${hyp(`${r}-X`, `${r}-Y`)},${r})`;
    const tr = `lte(${hyp(`X-${xr}`, `${r}-Y`)},${r})`;
    const bl = `lte(${hyp(`${r}-X`, `Y-${yr}`)},${r})`;
    const br = `lte(${hyp(`X-${xr}`, `Y-${yr}`)},${r})`;
    return (
        `if(lt(X,${r}),` +
            `if(lt(Y,${r}),if(${tl},${insideA},${outsideA}),` +
            `if(gte(Y,${yr}),if(${bl},${insideA},${outsideA}),${insideA})),` +
        `if(gte(X,${xr}),` +
            `if(lt(Y,${r}),if(${tr},${insideA},${outsideA}),` +
            `if(gte(Y,${yr}),if(${br},${insideA},${outsideA}),${insideA})),` +
            `${insideA}))`
    );
}

function roundedLavfi(w, h, r, alphaVal, color = "black") {
    const expr = roundedAlphaExpr(w, h, r, alphaVal, 0);
    return `color=c=${color}:s=${w}x${h}:d=1:r=1,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='${expr}'`;
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

    const target = await resolveTarget(conn, m, text);
    if (!target) {
        return m.reply(
            "اكتب رقم أو يوزر أو رد على شخص\n" +
            usedPrefix + command + " 22236416903\n" +
            usedPrefix + command + " @user"
        );
    }

    const font = boldFont();
    if (!font) return m.reply("ثبت الخط العريض:\nsudo apt install fonts-dejavu");

    await conn.sendMessage(m.chat, { react: { text: "🌑", key: m.key } }).catch(() => {});

    const phone = await getPhone(conn, target.jid);
    const checkJid = phone ? phone + "@s.whatsapp.net" : target.jid;

    let exists = false;
    try {
        const [wa] = await conn.onWhatsApp(checkJid);
        exists = !!(wa && wa.exists);
    } catch {}

    const banned = !exists;
    const shown = phone ? splitNum(phone).shown : "@" + target.user;
    const { cc, rest } = phone ? splitNum(phone) : { cc: "@", rest: target.user };
    const statusLines = wrapText(
        banned ? shown + " is banned from using whatsapp"
               : shown + " is not banned from using whatsapp",
        26
    );

    const dir = join(tmpdir(), "lynox-tawtheeq");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const bg = join(dir, "bg.jpg");
    const png = join(dir, (phone || target.user) + ".png");

    try {
        await saveBg(bg);

        const ccDisplay = /^\d+$/.test(cc) ? "+" + cc : cc;
        const restLen = String(rest).length;
        const numFont = restLen <= 10 ? 58 : restLen <= 13 ? 50 : 42;
        const numY = Math.round(795 - numFont / 2);

        const statusColor = banned ? ACCENT_RED : ACCENT_GREEN;
        const statusLabel = banned ? "BANNED" : "ACTIVE";

        // ---------- أبعاد ----------
        const IMG_R = 60;

        // كارت الرقم
        const CARD_W = 900, CARD_H = 220, CARD_R = 34;
        const CARD_X = 90,  CARD_Y = 690;

        // شارة الحالة (بنفس ستايل الحقل: خلفية داكنة + إطار ملوّن)
        const BADGE_W = 224, BADGE_H = 58, BADGE_R = 29;
        const BADGE_X = Math.round((1080 - BADGE_W) / 2);
        const BADGE_Y = 1224;
        const B_BD = 3; // سماكة الإطار

        // زر NEXT
        const NEXT_W = 320, NEXT_H = 84, NEXT_R = 42;
        const NEXT_X = Math.round((1080 - NEXT_W) / 2);
        const NEXT_Y = 1362;
        const N_BD = 3;

        const imgAlpha = roundedAlphaExpr(1080, 1920, IMG_R, 255, 0);

        // كارت الرقم - تعبئة داكنة شفافة
        const cardInput = roundedLavfi(CARD_W, CARD_H, CARD_R, 150, "black");

        // إطار الشارة (خارجي ملوّن) + تعبئة داخلية داكنة
        const badgeBorder = roundedLavfi(BADGE_W, BADGE_H, BADGE_R, 240, statusColor);
        const badgeFill   = roundedLavfi(BADGE_W - B_BD*2, BADGE_H - B_BD*2, BADGE_R - B_BD, 190, "black");

        // إطار NEXT + تعبئة داخلية
        const nextBorder = roundedLavfi(NEXT_W, NEXT_H, NEXT_R, 240, ACCENT_CYAN);
        const nextFill   = roundedLavfi(NEXT_W - N_BD*2, NEXT_H - N_BD*2, NEXT_R - N_BD, 190, "black");

        // ---------- خلفية ----------
        const bgChain = [
            "scale=1080:1920:force_original_aspect_ratio=increase",
            "crop=1080:1920",
            "drawbox=x=0:y=0:w=1080:h=1920:color=black@0.58:t=fill",
            "drawbox=x=0:y=0:w=1080:h=420:color=black@0.35:t=fill",
            "drawbox=x=0:y=1480:w=1080:h=440:color=black@0.35:t=fill",
            `drawbox=x=490:y=110:w=100:h=4:color=${ACCENT_CYAN}@0.95:t=fill`
        ].join(",");

        const statusDraw = statusLines.map((line, i) =>
            `drawtext=fontfile='${font}':text='${esc(line)}':fontcolor=white:fontsize=30:borderw=2:bordercolor=black@0.55:x=(w-text_w)/2:y=${990 + i * 48}`
        );

        // ---------- النصوص ----------
        const overlayContent = [
            // الهيدر
            `drawtext=fontfile='${font}':text='${BRAND}':fontcolor=white:fontsize=58:borderw=2:bordercolor=black@0.6:x=(w-text_w)/2:y=150`,
            "drawbox=x=340:y=248:w=400:h=1:color=white@0.35:t=fill",
            `drawtext=fontfile='${font}':text='VERIFICATION  SYSTEM':fontcolor=white@0.9:fontsize=22:x=(w-text_w)/2:y=272`,

            // حقول الرقم
            `drawtext=fontfile='${font}':text='CODE':fontcolor=${ACCENT_CYAN}:fontsize=20:x=120:y=712`,
            `drawtext=fontfile='${font}':text='${esc(ccDisplay)}':fontcolor=white:fontsize=56:borderw=2:bordercolor=black@0.5:x=120:y=${795 - 28}`,
            "drawbox=x=320:y=690:w=2:h=220:color=white@0.45:t=fill",
            `drawtext=fontfile='${font}':text='NUMBER':fontcolor=${ACCENT_CYAN}:fontsize=20:x=360:y=712`,
            `drawtext=fontfile='${font}':text='${esc(rest)}':fontcolor=white:fontsize=${numFont}:borderw=2:bordercolor=black@0.5:x=360:y=${numY}`,

            ...statusDraw,

            // نص شارة الحالة (بلون الحالة)
            `drawtext=fontfile='${font}':text='${statusLabel}':fontcolor=${statusColor}:fontsize=28:x=(w-text_w)/2:y=${BADGE_Y + 13}`,

            // نص زر NEXT (بلون ACCENT)
            `drawtext=fontfile='${font}':text='NEXT':fontcolor=${ACCENT_CYAN}:fontsize=34:x=(w-text_w)/2:y=${NEXT_Y + 23}`,

            // الفوتر
            `drawtext=fontfile='${font}':text='BY ${BRAND}':fontcolor=white@0.75:fontsize=26:x=(w-text_w)/2:y=1820`
        ].join(",");

        // ---------- filter_complex (5 مدخلات) ----------
        const filterComplex =
            `[0:v]${bgChain}[bg];` +
            `[bg][1:v]overlay=x=${CARD_X}:y=${CARD_Y}[bgCard];` +
            `[bgCard][2:v]overlay=x=${BADGE_X}:y=${BADGE_Y}[bgBadgeB];` +
            `[bgBadgeB][3:v]overlay=x=${BADGE_X + B_BD}:y=${BADGE_Y + B_BD}[bgBadgeF];` +
            `[bgBadgeF][4:v]overlay=x=${NEXT_X}:y=${NEXT_Y}[bgNextB];` +
            `[bgNextB][5:v]overlay=x=${NEXT_X + N_BD}:y=${NEXT_Y + N_BD}[bgNextF];` +
            `[bgNextF]${overlayContent},format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='${imgAlpha}'[out]`;

        await new Promise((resolve, reject) => {
            const p = spawn("ffmpeg", [
                "-y",
                "-loop", "1", "-i", bg,
                "-f", "lavfi", "-i", cardInput,
                "-f", "lavfi", "-i", badgeBorder,
                "-f", "lavfi", "-i", badgeFill,
                "-f", "lavfi", "-i", nextBorder,
                "-f", "lavfi", "-i", nextFill,
                "-filter_complex", filterComplex,
                "-map", "[out]",
                "-frames:v", "1",
                png
            ]);
            let err = "";
            p.stderr.on("data", d => { err += d.toString(); });
            p.on("error", reject);
            p.on("close", code => code === 0 ? resolve(true) : reject(new Error(err.slice(-800) || "ffmpeg")));
        });

        await conn.sendMessage(m.chat, { image: { url: png } }, { quoted: m });

        if (banned) {
            const n = nextCount();
            await conn.sendMessage(CHANNEL, {
                image: { url: png },
                caption: `*#${n}*\n> 𝐋𝐘𝐍𝐎𝐗`
            }).catch(e => console.error("[TAWTHEEQ-CHANNEL]", e));
        }
    } catch (e) {
        console.error("[TAWTHEEQ]", e);
        return m.reply("فشل إنشاء الصورة. ثبت ffmpeg:\nsudo apt install ffmpeg fonts-dejavu");
    } finally {
        try { unlinkSync(png); } catch {}
    }
};

handler.help = ["توثيق"];
handler.tags = ["tools"];
handler.command = /^(توثيق|mooncheck)$/i;

export default handler;
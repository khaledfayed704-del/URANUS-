// server.js
// ✧ URANOS SYSTEM ✧ - موقع تنصيب البوتات الفرعية 🌐
// امتداد ويب لبلوقن تنصيب (jadibot) - نفس منطق الربط بالظبط، غير إنه بيرجع الكود لصفحة ويب بدل واتساب
// الثيم: نفس ثيم لوحة LYNIKV (داكن/فاتح، حدود سميكة، ظلال صلبة، ليموني + وردي)

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { gataJadiBot } from './plugins/تنصيب.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOMAIN = 'https://lynox.hidenfree.com'
// مهم: على استضافات البانل (زي HidenCloud/Pterodactyl) البورت بيتحدد من "Allocations"
// مش من الكود، فلو حاططلك بورت تاني في البانل، خليه في متغير البيئة SERVER_PORT
const FIXED_PORT = Number(process.env.SERVER_PORT || process.env.PORT || 24691)
const PAIR_TIMEOUT_MS = 45000

function extractNumber(input) {
    let cleaned = String(input || '').replace(/\s+/g, '')
    cleaned = cleaned.replace(/^\+/, '')
    let match = cleaned.match(/\d+/)
    return match ? match[0] : ''
}

function sendJSON(res, status, obj) {
    if (res.headersSent) return
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(obj))
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
            if (data.length > 1e6) {
                req.destroy()
                reject(new Error('payload too large'))
            }
        })
        req.on('end', () => resolve(data))
        req.on('error', reject)
    })
}

const PAGE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark light">
<title>✧ URANOS - ربط بوت فرعي ✧</title>
<meta property="og:title" content="✧ URANOS SYSTEM ✧">
<meta property="og:description" content="ربط بوت فرعي عن طريق الموقع">
<meta property="og:image" content="https://files.catbox.moe/amyy67.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://files.catbox.moe/amyy67.jpg">
<meta name="theme-color" content="#0b0d12">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#0b0d12; --surface:#12151d; --surface2:#0c0f16;
  --edge:#e6ebf5; --edge-soft:rgba(230,235,245,.26);
  --txt:#f2f5fb; --muted:#8b95ac;
  --pop:#c8ff4d; --popInk:#c8ff4d; --on:#0e1105;
  --pop2:#ff5c8a; --pop2Ink:#ff7ba3; --on2:#33061a;
  --okInk:#2ee6a8; --errInk:#ff6b81;
  --hs:#c8ff4d;
  --focusSh:rgba(200,255,77,.28);
  --sans:'Alexandria','Tajawal','Segoe UI',Tahoma,sans-serif;
  --mono:'Space Mono',Consolas,monospace;
  --radius:14px;
}
html[data-theme="light"]{
  --bg:#f2efe7; --surface:#ffffff; --surface2:#f6f4ec;
  --edge:#16181f; --edge-soft:rgba(22,24,31,.28);
  --txt:#16181f; --muted:#5b6372;
  --pop:#c9f24d; --popInk:#6f9a00; --on:#15170a;
  --pop2:#ff5c8a; --pop2Ink:#d61f5e; --on2:#2c0716;
  --okInk:#0f9d6c; --errInk:#dc2f4f;
  --hs:#16181f;
  --focusSh:rgba(22,24,31,.20);
}

*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scrollbar-color:var(--pop) var(--surface2)}
body{
  font-family:var(--sans);background:var(--bg);color:var(--txt);
  min-height:100vh;line-height:1.75;overflow-x:hidden;
  display:flex;align-items:center;justify-content:center;padding:36px 16px;
}
body::before{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:
    radial-gradient(900px 520px at 85% -10%,rgba(200,255,77,.07),transparent 60%),
    radial-gradient(700px 480px at -10% 105%,rgba(255,92,138,.06),transparent 60%),
    linear-gradient(rgba(230,235,245,.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(230,235,245,.05) 1px,transparent 1px);
  background-size:auto,auto,46px 46px,46px 46px;
}
html[data-theme="light"] body::before{background-image:
    radial-gradient(900px 520px at 85% -10%,rgba(111,154,0,.10),transparent 60%),
    radial-gradient(700px 480px at -10% 105%,rgba(214,31,94,.08),transparent 60%),
    linear-gradient(rgba(22,24,31,.06) 1px,transparent 1px),
    linear-gradient(90deg,rgba(22,24,31,.06) 1px,transparent 1px);}
::selection{background:var(--pop);color:var(--on)}
:focus-visible{outline:3px solid var(--popInk);outline-offset:2px}

.card{
  position:relative;z-index:1;width:100%;max-width:440px;
  background:var(--surface);border:3px solid var(--edge);border-radius:18px;
  box-shadow:-10px 10px 0 0 var(--hs);padding:30px 24px 22px;
  animation:pop .5s cubic-bezier(.2,.9,.3,1.1) both;
}
@keyframes pop{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}

.topline{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}
.chip.live{
  display:inline-flex;align-items:center;gap:8px;background:var(--pop);color:var(--on);
  border:2px solid var(--on);border-radius:9px;padding:6px 12px;
  font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:2px;
}
.chip.live::before{content:"";width:8px;height:8px;background:var(--on);border-radius:2px;animation:blink 1.4s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
#themeBtn{
  width:40px;height:40px;border-radius:10px;border:2px solid var(--edge);background:var(--surface2);
  color:var(--txt);font-size:17px;line-height:1;cursor:pointer;transition:.15s;margin:0;padding:0;width:40px;
}
#themeBtn:hover{background:var(--pop);color:var(--on);border-color:var(--on);box-shadow:-4px 4px 0 0 var(--pop2);transform:translate(2px,-2px)}

.head{text-align:center;margin-bottom:16px}
.logo{font-size:30px;font-weight:900;letter-spacing:1px}
.logo span{color:var(--popInk)}
.tag{
  display:inline-block;margin-top:8px;font-family:var(--mono);font-size:10px;letter-spacing:3px;
  color:var(--popInk);border:1.5px solid var(--pop);border-radius:7px;padding:4px 12px;
}
.sub{color:var(--muted);font-size:13.5px;margin-top:12px}

.hazard{
  height:10px;border-radius:7px;border:2px solid var(--edge);margin:16px 0 20px;
  background:repeating-linear-gradient(-45deg,var(--pop) 0 12px,#10131a 12px 24px);
}

label{display:block;font-size:12px;font-weight:800;color:var(--muted);margin-bottom:7px}
input[type=text]{
  width:100%;padding:13px 14px;background:var(--surface2);border:2px solid var(--edge-soft);
  border-radius:10px;color:var(--txt);font-family:var(--mono);font-size:16px;letter-spacing:1px;
  outline:none;direction:ltr;text-align:center;transition:.15s;
}
input[type=text]:hover{border-color:var(--edge)}
input[type=text]:focus{border-color:var(--pop);box-shadow:-4px 4px 0 0 var(--focusSh)}

button.act{
  width:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;
  background:var(--pop);color:var(--on);border:2px solid var(--on);border-radius:10px;
  padding:13px 22px;font-family:inherit;font-size:14.5px;font-weight:900;cursor:pointer;
  box-shadow:-5px 5px 0 0 var(--edge);transition:.14s;
}
button.act:hover{transform:translate(2px,-2px);box-shadow:-7px 7px 0 0 var(--edge)}
button.act:active{transform:translate(-3px,3px);box-shadow:0 0 0 0 var(--edge)}
button.act:disabled{opacity:.45;cursor:not-allowed;box-shadow:none;transform:none}
button.act.ghost{background:var(--surface2);color:var(--txt);border-color:var(--edge-soft);box-shadow:none;margin-top:12px}
button.act.ghost:hover{border-color:var(--pop);color:var(--popInk);box-shadow:-4px 4px 0 0 var(--focusSh);transform:translate(1px,-1px)}

.hint{font-size:12px;color:var(--muted);margin-top:10px;text-align:center;line-height:1.9}

.spinner{
  display:none;width:24px;height:24px;margin:16px auto 0;
  border:3px solid var(--edge-soft);border-top-color:var(--pop2);border-radius:50%;animation:spin .8s linear infinite;
}
.spinner.show{display:block}
@keyframes spin{to{transform:rotate(360deg)}}

.error{
  display:none;margin-top:16px;padding:10px 14px;border-radius:10px;text-align:center;
  border:2px solid var(--pop2);color:var(--errInk);background:rgba(255,92,138,.08);
  font-size:13px;font-weight:800;
}
.error.show{display:block}

.result{display:none;margin-top:22px;text-align:center}
.result.show{display:block;animation:pop .4s cubic-bezier(.2,.9,.3,1.1) both}
.code-box{
  font-family:var(--mono);font-size:28px;font-weight:700;letter-spacing:5px;direction:ltr;
  background:var(--surface2);border:2px solid var(--edge-soft);border-inline-start:5px solid var(--pop);
  border-radius:12px;padding:16px;color:var(--popInk);user-select:all;word-break:break-all;
}
.steps{
  text-align:right;font-size:13px;color:var(--muted);margin-top:18px;line-height:2.1;
  border:2px dashed var(--edge-soft);border-radius:12px;padding:12px 14px;
}

footer{
  text-align:center;margin-top:22px;padding-top:14px;border-top:2px dashed var(--edge-soft);
  font-family:var(--mono);font-size:10.5px;letter-spacing:3px;color:var(--muted);
}
footer b{color:var(--popInk)}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
}
</style>
</head>
<body>
  <div class="card">
    <div class="topline">
      <span class="chip live">SYSTEM ONLINE</span>
      <button id="themeBtn" title="تبديل السمة" type="button">🌙</button>
    </div>

    <div class="head">
      <div class="logo">✧ <span>URANOS</span> ✧</div>
      <div class="tag">SUB-BOT PAIRING</div>
      <div class="sub">ربط بوت فرعي عن طريق الموقع</div>
    </div>

    <div class="hazard"></div>

    <label for="numInput">رقم الهاتف (مع كود الدولة)</label>
    <input type="text" id="numInput" placeholder="رقم الهاتف" inputmode="numeric" autocomplete="off">
    <div class="hint">اكتب الرقم بكود الدولة من غير + أو مسافات</div>

    <button class="act" id="pairBtn">🔑 احصل على كود الربط</button>
    <button class="act ghost" id="devBtn">👨‍💻 صفحة المطور</button>

    <div class="spinner" id="spinner"></div>
    <div class="error" id="errorBox"></div>

    <div class="result" id="resultBox">
      <div class="code-box" id="codeText"></div>
      <button class="act ghost" id="copyBtn">📋 نسخ الكود</button>
      <div class="steps">
        ❶ افتح الواتساب على نفس الرقم اللي كتبته<br>
        ❷ ادخل على القائمة (الثلاث نقاط)<br>
        ❸ اختر "الأجهزة المرتبطة"<br>
        ❹ اضغط على "ربط بجهاز" ثم "الربط برقم الهاتف"<br>
        ❺ أدخل الكود اللي فوق
      </div>
    </div>

    <footer>✧ <b>URANOS</b> SYSTEM ✧</footer>
  </div>

<script>
var numInput = document.getElementById('numInput');
var pairBtn = document.getElementById('pairBtn');
var devBtn = document.getElementById('devBtn');
var spinner = document.getElementById('spinner');
var errorBox = document.getElementById('errorBox');
var resultBox = document.getElementById('resultBox');
var codeText = document.getElementById('codeText');
var copyBtn = document.getElementById('copyBtn');
var themeBtn = document.getElementById('themeBtn');

function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('panelTheme', t); } catch (e) {}
  themeBtn.textContent = (t === 'light') ? '☀️' : '🌙';
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'light' ? '#f2efe7' : '#0b0d12');
}
themeBtn.addEventListener('click', function(){
  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});
(function(){
  var t = 'dark';
  try { t = localStorage.getItem('panelTheme') || 'dark'; } catch (e) {}
  applyTheme(t);
})();

devBtn.addEventListener('click', function(){
  window.location.href = 'https://lynox.duckdns.org/';
});

function showError(msg){ errorBox.textContent = msg; errorBox.classList.add('show'); }
function hideError(){ errorBox.classList.remove('show'); }

pairBtn.addEventListener('click', async function(){
  hideError();
  resultBox.classList.remove('show');
  var number = numInput.value.trim();
  if (!number) { showError('اكتب رقم الهاتف الأول'); return; }

  pairBtn.disabled = true;
  spinner.classList.add('show');

  try {
    var res = await fetch('/api/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: number })
    });
    var data = await res.json();
    if (!res.ok) {
      showError(data.error || 'حصل خطأ، حاول تاني');
    } else {
      codeText.textContent = data.code;
      resultBox.classList.add('show');
    }
  } catch (e) {
    showError('فشل الاتصال بالسيرفر');
  } finally {
    pairBtn.disabled = false;
    spinner.classList.remove('show');
  }
});

copyBtn.addEventListener('click', function(){
  navigator.clipboard.writeText(codeText.textContent).then(function(){
    copyBtn.textContent = '✅ تم النسخ';
    setTimeout(function(){ copyBtn.textContent = '📋 نسخ الكود'; }, 1500);
  });
});
</script>
</body>
</html>`

async function handlePairRequest(req, res) {
    try {
        const raw = await readBody(req)
        let body = {}
        try {
            body = JSON.parse(raw || '{}')
        } catch {
            return sendJSON(res, 400, { error: 'بيانات غير صالحة' })
        }

        const number = extractNumber(body.number)
        if (!number || number.length < 7) {
            return sendJSON(res, 400, { error: 'رقم الهاتف غير صحيح' })
        }

        // تأكد إن نظام البوتات الفرعية مفعّل من إعدادات البوت الرئيسي
        const mainJid = global.conn?.user?.jid
        if (mainJid && global.db?.data?.settings?.[mainJid]?.jadibotmd === false) {
            return sendJSON(res, 403, { error: 'نظام البوتات الفرعية معطل حالياً من المطور' })
        }

        const pathGataJadiBot = path.join(__dirname, 'URSubBot', number)
        if (!fs.existsSync(pathGataJadiBot)) {
            fs.mkdirSync(pathGataJadiBot, { recursive: true })
        }

        let responded = false

        const timeout = setTimeout(() => {
            if (!responded) {
                responded = true
                sendJSON(res, 504, { error: 'انتهت مهلة الاتصال، حاول مرة أخرى' })
            }
        }, PAIR_TIMEOUT_MS)

        const finish = (status, obj) => {
            if (responded) return
            responded = true
            clearTimeout(timeout)
            sendJSON(res, status, obj)
        }

        // كائن conn وهمي بيلتقط كود الربط بدل ما يبعته في واتساب فعلي
        const fakeConn = {
            sendMessage: async (jid, msg) => {
                const text = msg?.text || ''
                const match = text.match(/كـود الـربـط:?\**\s*([A-Za-z0-9-]{6,})/)
                if (match) finish(200, { code: match[1], number })
            },
            sendButton: async (jid, msg, footer, image, x, buttons) => {
                const btn = Array.isArray(buttons) ? buttons[0] : null
                const code = btn ? btn[1] : null
                if (code) {
                    finish(200, { code, number })
                } else {
                    const text = msg || ''
                    const match = String(text).match(/كـود الـربـط:?\**\s*([A-Za-z0-9-]{6,})/)
                    if (match) finish(200, { code: match[1], number })
                }
            }
        }

        const fakeM = { chat: `web_${number}_${Date.now()}` }

        gataJadiBot({
            pathGataJadiBot,
            m: fakeM,
            conn: fakeConn,
            args: [number],
            usedPrefix: '.',
            command: 'تنصيب',
            fromCommand: false
        }, number)

    } catch (e) {
        console.error('[web-pair] error:', e)
        if (!res.headersSent) sendJSON(res, 500, { error: 'حدث خطأ غير متوقع' })
    }
}

export default function startServer(conn, port) {
    const server = http.createServer(async (req, res) => {
        try {
            if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                return res.end(PAGE_HTML)
            }
            if (req.method === 'POST' && req.url === '/api/pair') {
                return handlePairRequest(req, res)
            }
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('404 - الصفحة غير موجودة')
        } catch (e) {
            console.error('[server] error:', e)
            if (!res.headersSent) {
                res.writeHead(500)
                res.end('500 - خطأ في السيرفر')
            }
        }
    })

    server.listen(FIXED_PORT, '0.0.0.0', () => {
        console.log(`🌐 موقع تنصيب البوتات الفرعية شغال على المنفذ ${FIXED_PORT}`)
        console.log(`🔗 الدومين: ${DOMAIN}`)
    })

    return server
}
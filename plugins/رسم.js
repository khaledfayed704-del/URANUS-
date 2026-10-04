// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: wall.js - جدار الرسم (نسخة محسنة مع قلم ملون)
// ============================================================

const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  margin: 0;
  padding: 0;
}
html, body {
  background: #0a0a1a;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 8px;
}
.container {
  max-width: 500px;
  width: 100%;
  margin: auto;
  padding: 12px;
  background: linear-gradient(145deg, #0f1a0f, #1a2a1a);
  border-radius: 16px;
  border: 2px solid #2ecc71;
  box-shadow: 0 0 40px rgba(46, 204, 113, 0.15);
}
h3 {
  font-size: 22px;
  color: #2ecc71;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(46, 204, 113, 0.3);
}
h3 span {
  font-size: 14px;
  color: #888;
  display: block;
  font-weight: normal;
}

/* اللون المختار */
.selected-color {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: rgba(0,0,0,0.5);
  padding: 8px 12px;
  border-radius: 10px;
  margin: 6px auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 250px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}
.selected-color .color-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 15px rgba(255,255,255,0.2);
}

/* قلم ملون - الشاشة الرئيسية */
.canvas-wrapper {
  position: relative;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #2ecc71;
  margin-bottom: 10px;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.1);
}
canvas {
  width: 100%;
  display: block;
  touch-action: none;
  cursor: crosshair;
  background: #fff;
  min-height: 400px;
}

/* لوحة الألوان */
.palette {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  padding: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  margin-bottom: 8px;
  border: 1px solid rgba(46, 204, 113, 0.2);
}
.color-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.2s;
}
.color-btn:hover {
  transform: scale(1.15);
  border-color: #fff;
}
.color-btn.active {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  transform: scale(1.1);
}

/* أدوات التحكم */
.controls {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 6px;
}
.ctrl-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
  flex: 1;
  min-width: 60px;
}
.ctrl-btn:hover {
  transform: scale(1.03);
  filter: brightness(1.1);
}
.ctrl-btn:active {
  transform: scale(0.95);
}
#clearBtn {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}
#undoBtn {
  background: linear-gradient(45deg, #f39c12, #e67e22);
}
#saveBtn {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
}
#eraserBtn {
  background: linear-gradient(45deg, #7f8c8d, #2c3e50);
}
#textBtn {
  background: linear-gradient(45deg, #3498db, #2980b9);
}

/* التحكم بالحجم */
.size-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.3);
  padding: 4px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  margin: 6px 0;
  justify-content: center;
}
.size-control label {
  color: #aaa;
  font-size: 13px;
  font-weight: 600;
}
#sizeRange {
  width: 120px;
  accent-color: #2ecc71;
  height: 4px;
}
#sizeDisplay {
  color: #fff;
  font-weight: 700;
  min-width: 25px;
  text-align: center;
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

/* نافذة النص */
#textModal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
}
#textModal.show {
  display: flex;
}
#textModal .modal-content {
  background: #1a2a1a;
  padding: 25px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  border: 2px solid #2ecc71;
}
#textModal input[type="text"] {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #2ecc71;
  background: rgba(255,255,255,0.05);
  color: #fff;
  font-size: 18px;
  margin-bottom: 12px;
}
#textModal input[type="text"]:focus {
  outline: none;
  border-color: #ffd700;
}
#textModal .modal-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
#textModal label {
  color: #aaa;
  font-size: 13px;
}
#textColor {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}
#textColor::-webkit-color-swatch-wrapper {
  padding: 0;
}
#textColor::-webkit-color-swatch {
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
}
#fontSelect {
  padding: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  color: #fff;
  border: 2px solid rgba(255,255,255,0.2);
  flex: 1;
  min-width: 120px;
}
#fontSelect option {
  background: #1a2a1a;
}
#textModal .modal-btns {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
#textModal .modal-btns button {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
}
#textSubmit {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #fff;
}
#textCancel {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: #fff;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #666;
  font-size: 11px;
  padding: 0 4px;
}
</style>
</head>
<body>
<div class="container">
<h3>🎨 قلم ملون <span>ارسم بحرية!</span></h3>

<div class="selected-color">
  <span>اللون:</span>
  <div class="color-circle" id="selectedColorCircle" style="background:#000;"></div>
  <span id="selectedColorName">أسود</span>
</div>

<div class="palette" id="palette"></div>

<div class="size-control">
  <label>✏️ الحجم:</label>
  <input type="range" id="sizeRange" min="2" max="40" value="8">
  <span id="sizeDisplay">8</span>
</div>

<div class="canvas-wrapper">
  <canvas id="canvas" width="800" height="600"></canvas>
</div>

<div class="controls">
  <button class="ctrl-btn" id="undoBtn">↩️ تراجع</button>
  <button class="ctrl-btn" id="eraserBtn">🧹 ممحاة</button>
  <button class="ctrl-btn" id="textBtn">📝 نص</button>
  <button class="ctrl-btn" id="clearBtn">🗑️ مسح</button>
  <button class="ctrl-btn" id="saveBtn">💾 حفظ</button>
</div>

<div class="info-bar">
  <span>🖱️ اسحب للرسم</span>
  <span>📐 800×600</span>
</div>
</div>

<!-- نافذة إضافة نص -->
<div id="textModal">
  <div class="modal-content">
    <input type="text" id="textField" placeholder="اكتب نصك هنا...">
    <div class="modal-row">
      <label>اللون:</label>
      <input type="color" id="textColor" value="#ff0000">
      <label>الخط:</label>
      <select id="fontSelect">
        <option value="Arial">Arial</option>
        <option value="'Arial Black'">Arial Black</option>
        <option value="'Comic Sans MS'">Comic Sans</option>
        <option value="'Courier New'">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Impact">Impact</option>
        <option value="'Times New Roman'">Times New Roman</option>
        <option value="Verdana">Verdana</option>
        <option value="'Monoton'">Monoton</option>
        <option value="'Pacifico'">Pacifico</option>
      </select>
    </div>
    <div class="modal-btns">
      <button id="textCancel">إلغاء</button>
      <button id="textSubmit">إضافة نص</button>
    </div>
  </div>
</div>

<script>
// ============================================================
// الألوان مع أسمائها
// ============================================================
var colors = [
  { hex: '#000000', name: 'أسود' },
  { hex: '#ffffff', name: 'أبيض' },
  { hex: '#ff0000', name: 'أحمر' },
  { hex: '#ff6b00', name: 'برتقالي' },
  { hex: '#ffd700', name: 'ذهبي' },
  { hex: '#ffff00', name: 'أصفر' },
  { hex: '#00ff00', name: 'أخضر' },
  { hex: '#00ff88', name: 'نعناعي' },
  { hex: '#00ffff', name: 'سماوي' },
  { hex: '#0088ff', name: 'أزرق' },
  { hex: '#0000ff', name: 'أزرق غامق' },
  { hex: '#6c5ce7', name: 'بنفسجي' },
  { hex: '#ff00ff', name: 'وردي' },
  { hex: '#ff69b4', name: 'زهري' },
  { hex: '#ff1493', name: 'وردي غامق' },
  { hex: '#2ecc71', name: 'زمردي' },
  { hex: '#e74c3c', name: 'أحمر داكن' },
  { hex: '#f39c12', name: 'برتقالي داكن' },
  { hex: '#9b59b6', name: 'بنفسجي غامق' },
  { hex: '#1abc9c', name: 'فيروزي' },
  { hex: '#34495e', name: 'أزرق رمادي' },
  { hex: '#e67e22', name: 'يوسفي' },
  { hex: '#c0392b', name: 'أحمر قرميدي' },
  { hex: '#8e44ad', name: 'بنفسجي داكن' },
  { hex: '#2c3e50', name: 'كحلي' },
  { hex: '#d35400', name: 'برتقالي محروق' },
  { hex: '#7f8c8d', name: 'رمادي' },
  { hex: '#bdc3c7', name: 'رمادي فاتح' },
  { hex: '#ecf0f1', name: 'أبيض رمادي' }
];

// ============================================================
// المتغيرات
// ============================================================
var currentColor = colors[0];
var currentSize = 8;
var isDrawing = false;
var isEraser = false;
var lastX = 0, lastY = 0;
var history = [];
var maxHistory = 50;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var W = 800, H = 600;

// ============================================================
// حفظ الحالة
// ============================================================
function saveState() {
  if (history.length > maxHistory) history.shift();
  history.push(canvas.toDataURL());
}

// خلفية بيضاء
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, W, H);
saveState();

// ============================================================
// دوال الرسم
// ============================================================
function getPos(e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var clientX, clientY;
  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
    e.preventDefault();
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: Math.min(Math.max((clientX - rect.left) * scaleX, 0), W),
    y: Math.min(Math.max((clientY - rect.top) * scaleY, 0), H)
  };
}

function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  var pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function draw(e) {
  e.preventDefault();
  if (!isDrawing) return;
  var pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = isEraser ? '#ffffff' : currentColor.hex;
  ctx.lineWidth = isEraser ? currentSize * 1.5 : currentSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function endDraw(e) {
  if (isDrawing) {
    isDrawing = false;
    saveState();
  }
}

// ============================================================
// أحداث الفأرة واللمس
// ============================================================
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', endDraw, { passive: false });

// ============================================================
// لوحة الألوان
// ============================================================
var palette = document.getElementById('palette');
colors.forEach(function(color, index) {
  var btn = document.createElement('div');
  btn.className = 'color-btn' + (index === 0 ? ' active' : '');
  btn.style.background = color.hex;
  btn.dataset.index = index;
  btn.onclick = function() {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentColor = color;
    document.getElementById('selectedColorCircle').style.background = color.hex;
    document.getElementById('selectedColorName').textContent = color.name;
    isEraser = false;
    document.getElementById('eraserBtn').textContent = '🧹 ممحاة';
  };
  palette.appendChild(btn);
});

// ============================================================
// حجم القلم
// ============================================================
document.getElementById('sizeRange').addEventListener('input', function() {
  currentSize = parseInt(this.value);
  document.getElementById('sizeDisplay').textContent = currentSize;
});

// ============================================================
// ممحاة
// ============================================================
document.getElementById('eraserBtn').addEventListener('click', function() {
  isEraser = !isEraser;
  this.textContent = isEraser ? '✏️ قلم' : '🧹 ممحاة';
  if (isEraser) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  }
});

// ============================================================
// تراجع
// ============================================================
document.getElementById('undoBtn').addEventListener('click', function() {
  if (history.length > 1) {
    history.pop();
    var img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[history.length - 1];
  }
});

// ============================================================
// مسح الكل
// ============================================================
document.getElementById('clearBtn').addEventListener('click', function() {
  if (confirm('🗑️ هل تريد مسح الرسم بالكامل؟')) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    saveState();
  }
});

// ============================================================
// حفظ الصورة
// ============================================================
document.getElementById('saveBtn').addEventListener('click', function() {
  var link = document.createElement('a');
  link.download = 'رسمتي_القلم_الملون.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ============================================================
// إضافة نص
// ============================================================
var textModal = document.getElementById('textModal');
document.getElementById('textBtn').addEventListener('click', function() {
  textModal.classList.add('show');
  document.getElementById('textField').focus();
});

document.getElementById('textCancel').addEventListener('click', function() {
  textModal.classList.remove('show');
  document.getElementById('textField').value = '';
});

document.getElementById('textSubmit').addEventListener('click', function() {
  var text = document.getElementById('textField').value;
  var color = document.getElementById('textColor').value;
  var font = document.getElementById('fontSelect').value;
  if (text) {
    ctx.font = '48px ' + font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, W/2, H/2);
    ctx.shadowBlur = 0;
    document.getElementById('textField').value = '';
    textModal.classList.remove('show');
    saveState();
  }
});

// ============================================================
// اختصارات الكيبورد
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    document.getElementById('undoBtn').click();
  }
  if (e.key === 'Escape') {
    textModal.classList.remove('show');
  }
});

// ============================================================
// تكيف الحجم
// ============================================================
function resizeCanvas() {
  var wrapper = canvas.parentElement;
  var rect = wrapper.getBoundingClientRect();
  canvas.style.width = rect.width + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
</script>
</body>
</html>`;

// ============================================================
// URANOS Engine — Wall Drawing Handler
// ============================================================
const handler = async (m, { conn }) => {
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
    await conn.relayMessage(
      m.chat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: "uranos-wall-v2"
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🎨 قلم ملون - ارسم بحرية!"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-wall-v2",
                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                            payload: html,
                            trusted_sources: ["uranos.dev"]
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
  } catch (e) {
    console.error('[WALL ERROR]', e);
    await m.reply('❌ فشل إرسال لوحة الرسم.');
  }
};

handler.help = ['رسم', 'draw', 'قلم'];
handler.tags = ['tools', 'fun'];
handler.command = ['رسم', 'draw', 'قلم'];

export default handler;
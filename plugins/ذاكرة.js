// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: memory.js - تحدي الذاكرة الملونة (3 ثواني + أسهل)
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
}
html, body {
  margin: 0;
  padding: 0;
  background: #111;
  font-family: Arial, sans-serif;
  color: #fff;
  text-align: center;
}
.container {
  max-width: 340px;
  margin: auto;
  padding: 10px;
  background: #0e1a0c;
  border-radius: 10px;
  border: 2px solid #2ecc71;
}
h3 {
  font-size: 18px;
  color: #2ecc71;
  margin: 5px 0;
}

/* حالة الوقت */
#timer {
  font-size: 14px;
  font-weight: bold;
  color: #f39c12;
  margin-bottom: 5px;
}

/* شبكة 8x8 */
#memoryGrid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  margin: 10px auto;
  width: 100%;
  max-width: 280px;
  border: 3px solid #2ecc71;
  border-radius: 8px;
  padding: 4px;
  background: #000;
}
.pixel {
  width: 100%;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
}

/* لوحة الألوان */
.palette {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  margin-bottom: 10px;
  padding: 5px;
  background: #1c2e1a;
  border-radius: 8px;
  border: 1px solid #2ecc71;
}
.color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
}
.color-btn.active {
  border: 4px solid #f1c40f;
  box-shadow: 0 0 15px rgba(241, 196, 15, 0.8);
}

/* عناصر التحكم */
.controls {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}
.btn {
  background: #2ecc71;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.btn.red {
  background: #e74c3c;
}
.btn:active {
  transform: scale(0.98);
}

/* النتيجة */
#overlay {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  z-index: 10;
}
#overlay .big {
  font-size: 22px;
  font-weight: bold;
  color: #2ecc71;
}
#overlay p {
  font-size: 14px;
  margin: 10px 0;
}
</style>
</head>
<body>
<div class="container">
<h3>🧠 تحدي الذاكرة 🧠</h3>
<div id="timer">⏱️ استعد...</div>

<div id="memoryGrid"></div>

<!-- لوحة الألوان -->
<div class="palette" id="palette"></div>

<div class="controls">
  <button class="btn" id="startBtn">🚀 ابدأ المستوى</button>
  <button class="btn red" id="resetBtn">🔄 إعادة اللعبة</button>
  <button class="btn" id="checkBtn">✅ تحقق من الإجابة</button>
</div>

<div id="overlay">
  <div class="big" id="overlayTitle"></div>
  <p id="overlayText"></p>
</div>
</div>

<script>
var patterns = [
  // المستوى 1: 6 مربعات ملونة (سهل جداً)
  {
    cells: [
      { index: 10, color: '#ff0000' }, { index: 11, color: '#00ff00' }, { index: 12, color: '#0000ff' },
      { index: 18, color: '#ffff00' }, { index: 19, color: '#ff00ff' }, { index: 20, color: '#00ffff' }
    ],
    name: 'المستوى 1 (سهل جداً)'
  },
  // المستوى 2: 10 مربعات ملونة (متوسط)
  {
    cells: [
      { index: 9, color: '#ff0000' }, { index: 10, color: '#00ff00' }, { index: 11, color: '#0000ff' },
      { index: 12, color: '#ffff00' }, { index: 17, color: '#ff00ff' }, { index: 18, color: '#00ffff' },
      { index: 19, color: '#ffa500' }, { index: 20, color: '#e74c3c' }, { index: 25, color: '#2ecc71' },
      { index: 26, color: '#ff69b4' }
    ],
    name: 'المستوى 2 (متوسط)'
  },
  // المستوى 3: 14 مربعاً ملوناً (أصعب شوي)
  {
    cells: [
      { index: 1, color: '#ff0000' }, { index: 2, color: '#00ff00' }, { index: 3, color: '#0000ff' },
      { index: 8, color: '#ffff00' }, { index: 9, color: '#ff00ff' }, { index: 10, color: '#00ffff' },
      { index: 11, color: '#ffa500' }, { index: 16, color: '#e74c3c' }, { index: 17, color: '#2ecc71' },
      { index: 18, color: '#ff69b4' }, { index: 24, color: '#ff0000' }, { index: 25, color: '#00ff00' },
      { index: 26, color: '#0000ff' }, { index: 27, color: '#ffff00' }
    ],
    name: 'المستوى 3 (أصعب شوي)'
  }
];

var currentLevel = 0;
var isTimerRunning = false;
var currentColor = '#ff0000';

// إنشاء الشبكة (64 مربعاً)
var grid = document.getElementById('memoryGrid');
for (var i = 0; i < 64; i++) {
  var pixel = document.createElement('div');
  pixel.className = 'pixel';
  pixel.style.background = '#ffffff';
  pixel.onclick = function() {
    if (isTimerRunning) return;
    this.style.background = currentColor;
  };
  grid.appendChild(pixel);
}

// لوحة الألوان
var palette = document.getElementById('palette');
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#e74c3c', '#2ecc71', '#ff69b4', '#8a2be2', '#c0c0c0'];
colors.forEach(function(color) {
  var btn = document.createElement('div');
  btn.className = 'color-btn';
  btn.style.background = color;
  btn.onclick = function() {
    currentColor = color;
    document.querySelectorAll('.color-btn').forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');
  };
  palette.appendChild(btn);
});

// عرض النمط لمدة 3 ثواني
function showPattern() {
  var currentPattern = patterns[currentLevel];
  var pixels = document.querySelectorAll('.pixel');
  
  isTimerRunning = true;
  document.getElementById('timer').textContent = '⏱️ راقب الشكل... (3 ثواني)';
  document.querySelector('h3').textContent = '🧠 ' + currentPattern.name;
  
  currentPattern.cells.forEach(function(cell) {
    var index = cell.index;
    pixels[index].style.background = cell.color;
  });
  
  for (var i = 0; i < 64; i++) {
    if (!currentPattern.cells.some(function(c) { return c.index === i; })) {
      pixels[i].style.background = '#ffffff';
    }
  }
  
  setTimeout(function() {
    isTimerRunning = false;
    document.getElementById('timer').textContent = '🕵️ ارسم ما تتذكره!';
    var pixels = document.querySelectorAll('.pixel');
    for (var i = 0; i < 64; i++) {
      pixels[i].style.background = '#ffffff';
    }
  }, 3000);
}

// التحقق من الإجابة
function checkAnswer() {
  if (isTimerRunning) return;
  var currentPattern = patterns[currentLevel];
  var pixels = document.querySelectorAll('.pixel');
  var isCorrect = true;
  
  for (var i = 0; i < 64; i++) {
    var expectedCell = currentPattern.cells.find(function(c) { return c.index === i; });
    var isColored = pixels[i].style.background !== 'rgb(255, 255, 255)' && pixels[i].style.background !== '#ffffff';
    
    if (expectedCell) {
      if (!isColored || pixels[i].style.background !== expectedCell.color) {
        isCorrect = false;
        break;
      }
    } else {
      if (isColored) {
        isCorrect = false;
        break;
      }
    }
  }
  
  if (isCorrect) {
    currentLevel++;
    if (currentLevel >= patterns.length) {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('overlayTitle').textContent = '🏆 أحسنت!';
      document.getElementById('overlayText').textContent = 'لقد أكملت جميع المستويات!';
    } else {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('overlayTitle').textContent = '🎉 صحيح!';
      document.getElementById('overlayText').textContent = 'انتقلت إلى المستوى التالي!';
      setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
        showPattern();
      }, 1500);
    }
  } else {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('overlayTitle').textContent = '😢 خسرت!';
    document.getElementById('overlayText').textContent = 'سيتم إعادة المستوى. استعد!';
    setTimeout(function() {
      document.getElementById('overlay').style.display = 'none';
      showPattern();
    }, 1500);
  }
}

// أزرار
var startBtn = document.getElementById('startBtn');
startBtn.onclick = function() {
  showPattern();
};

var resetBtn = document.getElementById('resetBtn');
resetBtn.onclick = function() {
  currentLevel = 0;
  showPattern();
};

var checkBtn = document.getElementById('checkBtn');
checkBtn.onclick = function() {
  checkAnswer();
};

// البدء الأولي
showPattern();
</script>
</body>
</html>`;

// ============================================================
// URANOS Engine — Pixel Memory Handler
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
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🧠 Pixel Memory"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-memory",
                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                            payload: html,
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
  } catch (e) {
    console.error('[MEMORY ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة الذاكرة.');
  }
};

handler.help = ['ذاكرة', 'memory', 'تحدي'];
handler.tags = ['tools', 'game'];
handler.command = ['ذاكرة', 'memory', 'تحدي'];

export default handler;
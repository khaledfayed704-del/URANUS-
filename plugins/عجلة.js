// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: wheel.js - عجلة الحظ (كلمات واضحة وكبيرة)
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
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  font-family: Arial, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
  color: #fff;
}
body {
  padding: 20px 0;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: 900;
  color: #2ecc71;
  text-shadow: 0 3px 8px rgba(0,0,0,0.8);
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.sub {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 15px;
}

/* --- صندوق عجلة الحظ --- */
.machine {
  position: relative;
  width: 90%;
  max-width: 350px;
  margin: 0 auto;
  background: linear-gradient(180deg, #1c2e1a, #0a1f08);
  border-radius: 25px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(46, 204, 113, 0.2);
  border: 3px solid #27ae60;
}

/* --- العجلة --- */
.wheel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  max-width: 280px;
  margin: 0 auto 20px auto;
  border-radius: 50%;
  border: 8px solid #27ae60;
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.5), inset 0 0 10px rgba(0,0,0,0.8);
  overflow: hidden;
}

#wheelCanvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* المؤشر (السهم) */
.pointer {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid #f1c40f;
  z-index: 10;
  filter: drop-shadow(0 3px 5px rgba(0,0,0,0.6));
}

/* زر الدوران */
.spin-btn {
  background: linear-gradient(180deg, #2ecc71, #27ae60);
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  padding: 15px;
  width: 100%;
  border-radius: 50px;
  border: 4px solid #2ecc71;
  cursor: pointer;
  box-shadow: 0 6px 0 #1e8449, 0 10px 20px rgba(0,0,0,0.6);
  transition: all 0.1s;
  letter-spacing: 2px;
  margin-bottom: 12px;
  outline: none;
}
.spin-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #1e8449, 0 5px 10px rgba(0,0,0,0.6);
}

/* النتيجة */
.result {
  font-size: 18px;
  font-weight: bold;
  color: #2ecc71;
  text-shadow: 0 0 10px #27ae60;
  min-height: 25px;
  margin-bottom: 10px;
}

/* عداد النقاط */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #0e1a0c;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #2ecc71;
  font-size: 13px;
  margin-bottom: 10px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.btn-reset {
  background: #444;
  color: #fff;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
</style>
</head>
<body>

<div class="title">🎡 URANOS WHEEL 🎡</div>
<div class="sub">أدر العجلة واكتشف حظك!</div>

<div class="machine">
  <div class="result" id="resultText">اضغط SPIN لتدوير العجلة!</div>

  <div class="wheel-container">
    <canvas id="wheelCanvas" width="300" height="300"></canvas>
    <div class="pointer"></div>
  </div>

  <button class="spin-btn" id="spinBtn">🎡 SPIN 🎡</button>

  <div class="scoreboard">
    <span>⭐ النقاط: <span id="score">0</span></span>
    <span>🎁 الجوائز: <span id="prizes">0</span></span>
  </div>
  
  <div class="controls">
    <button class="btn-reset" id="resetBtn">🔄 إعادة</button>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const resultText = document.getElementById('resultText');
  const spinBtn = document.getElementById('spinBtn');
  const scoreEl = document.getElementById('score');
  const prizesEl = document.getElementById('prizes');
  const resetBtn = document.getElementById('resetBtn');

  const segments = [
    { label: "+10", color: "#e74c3c" },
    { label: "+50", color: "#3498db" },
    { label: "خسارة", color: "#7f8c8d" },
    { label: "+20", color: "#f1c40f" },
    { label: "+100", color: "#9b59b6" },
    { label: "خسارة", color: "#e67e22" },
    { label: "+5", color: "#2ecc71" },
    { label: "جاكبوت", color: "#1abc9c" }
  ];

  let currentRotation = 0;
  let isSpinning = false;
  let score = 0;
  let prizes = 0;

  function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 5;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation * Math.PI / 180);

    const segmentAngle = (2 * Math.PI) / segments.length;

    for (let i = 0; i < segments.length; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // رسم القطعة
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = segments[i].color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // رسم النص (مستقيم وواضح)
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.font = 'bold 20px Arial';
      ctx.fillText(segments[i].label, radius * 0.65, 7);
      ctx.restore();
    }

    // رسم مركز العجلة
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  function getResult() {
    const segmentAngle = 360 / segments.length;
    const normalizedAngle = (360 - (currentRotation % 360)) % 360;
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    return segments[segmentIndex];
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = '... جاري الدوران ...';
    resultText.textContent = '';

    // دوران عشوائي (بين 5 و 10 لفات كاملة)
    const randomExtraDegrees = Math.floor(Math.random() * 360);
    const totalDegrees = (Math.floor(Math.random() * 5) + 5) * 360 + randomExtraDegrees;
    const targetRotation = currentRotation + totalDegrees;

    // أنيميشن الدوران
    const duration = 4000;
    const startTime = performance.now();
    const startRotation = currentRotation;

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (تسارع ثم تباطؤ)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      currentRotation = startRotation + (totalDegrees * easeOut);
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // انتهى الدوران
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.textContent = '🎡 SPIN 🎡';

        const result = getResult();
        resultText.textContent = '🎉 النتيجة: ' + result.label;

        // تحديث النقاط بناءً على النتيجة
        if (result.label === 'جاكبوت') {
          score += 500;
          prizes++;
        } else if (result.label === 'خسارة') {
          // لا شيء
        } else {
          // تحويل النص (مثل +10) إلى رقم
          score += parseInt(result.label.replace('+', ''));
          prizes++;
        }
        scoreEl.textContent = score;
        prizesEl.textContent = prizes;
      }
    }

    requestAnimationFrame(animate);
  }

  function resetGame() {
    currentRotation = 0;
    score = 0;
    prizes = 0;
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = '🎡 SPIN 🎡';
    resultText.textContent = 'اضغط SPIN لتدوير العجلة!';
    scoreEl.textContent = score;
    prizesEl.textContent = prizes;
    drawWheel();
  }

  spinBtn.addEventListener('click', spinWheel);
  resetBtn.addEventListener('click', resetGame);

  // رسم العجلة لأول مرة
  drawWheel();
})();
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Wheel of Fortune Handler
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
                  messageText: "🎡 URANOS Wheel"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-wheel-html",
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
    console.error('[URANOS WHEEL ERROR]', e);
    await m.reply('❌ فشل إرسال عجلة الحظ.');
  }
};

handler.help = ['عجلة', 'حظ', 'wheel'];
handler.tags = ['tools', 'game'];
handler.command = ['عجلة', 'حظ', 'wheel', 'عجلة الحظ'];

export default handler;
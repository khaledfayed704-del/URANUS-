// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: shellgame.js - لعبة الكوب والكرة (نسخة بدون خداع)
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
  padding: 10px 0;
  text-align: center;
}
.title {
  font-size: 18px;
  font-weight: 900;
  color: #2ecc71;
  text-shadow: 0 3px 8px rgba(0,0,0,0.8);
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.sub {
  font-size: 11px;
  color: #ccc;
  margin-bottom: 10px;
}

/* --- صندوق اللعبة --- */
.machine {
  position: relative;
  width: 90%;
  max-width: 280px;
  margin: 0 auto;
  background: linear-gradient(180deg, #1c2e1a, #0a1f08);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(46, 204, 113, 0.2);
  border: 3px solid #27ae60;
}

.status {
  font-size: 14px;
  font-weight: bold;
  color: #2ecc71;
  text-shadow: 0 0 10px #27ae60;
  min-height: 20px;
  margin-bottom: 8px;
}

/* --- الأكواب المصغرة --- */
.cups-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
  height: 80px;
  align-items: flex-end;
}

.cup-wrapper {
  position: absolute;
  bottom: 0;
  width: 55px;
  height: 80px;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  z-index: 2;
}

.cup {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #f9e79f, #f1c40f 30%, #d4ac0d 80%, #b8860b);
  border-radius: 8px 8px 25px 25px;
  box-shadow: inset -7px 0 10px rgba(0,0,0,0.3), inset 7px 0 10px rgba(255,255,255,0.3), 0 5px 10px rgba(0,0,0,0.6);
  border: 2px solid #8b6914;
}
.cup::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 3px;
  width: 45px;
  height: 22px;
  background: #4a3200;
  border-radius: 50%;
  box-shadow: inset 0 4px 8px rgba(0,0,0,0.8);
}
.cup::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 8px;
  width: 40px;
  height: 10px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%);
  border-radius: 50%;
}

/* الكرة */
.ball {
  position: absolute;
  bottom: 8px;
  left: 14px;
  width: 27px;
  height: 27px;
  background: radial-gradient(circle at 30% 30%, #fff, #e74c3c 60%, #c0392b);
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 5;
}
.cup-wrapper.visible .ball {
  opacity: 1;
}

/* أزرار */
.controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.btn-play, .btn-reset {
  background: #2ecc71;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  outline: none;
}
.btn-play:active, .btn-reset:active {
  transform: scale(0.95);
}
.btn-reset {
  background: #555;
}

/* عدادات */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #0e1a0c;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #2ecc71;
  font-size: 12px;
  margin-bottom: 8px;
}
</style>
</head>
<body>

<div class="title">🫙 URANOS SHELL 🫙</div>
<div class="sub">خمن وين الكرة المختبئة!</div>

<div class="machine">
  <div class="status" id="statusText">اضغط "ابدأ" لتحريك الأكواب</div>

  <div class="cups-container" id="cupsContainer">
    <div class="cup-wrapper" data-index="0">
      <div class="cup"></div>
      <div class="ball"></div>
    </div>
    <div class="cup-wrapper" data-index="1">
      <div class="cup"></div>
      <div class="ball"></div>
    </div>
    <div class="cup-wrapper" data-index="2">
      <div class="cup"></div>
      <div class="ball"></div>
    </div>
  </div>

  <div class="scoreboard">
    <span>✅ صح: <span id="correct">0</span></span>
    <span>❌ غلط: <span id="wrong">0</span></span>
  </div>

  <div class="controls">
    <button class="btn-play" id="playBtn">▶️ ابدأ</button>
    <button class="btn-reset" id="resetBtn">🔄 إعادة</button>
  </div>
</div>

<script>
(function() {
  const cups = document.querySelectorAll('.cup-wrapper');
  const statusText = document.getElementById('statusText');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const correctEl = document.getElementById('correct');
  const wrongEl = document.getElementById('wrong');

  let ballIndex = 1;
  let positions = [0, 1, 2];
  let correct = 0;
  let wrong = 0;
  let isPlaying = false;
  let isRevealed = false;
  let currentXPositions = [0, 0, 0];
  let visibleIndex = -1;

  function updatePositions() {
    const gap = 70;
    for (let i = 0; i < 3; i++) {
      const x = (positions[i] - 1) * gap;
      cups[i].style.transform = 'translateX(' + x + 'px)';
      currentXPositions[i] = x;
    }
  }

  // إظهار الكرة
  function setBall(show, revealIndex) {
    cups.forEach(cup => cup.classList.remove('visible'));
    if (show) {
      const cupIndex = positions.indexOf(revealIndex);
      cups[cupIndex].classList.add('visible');
    }
  }

  function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    isRevealed = false;
    playBtn.textContent = '... جاري التحريك ...';
    statusText.textContent = '👀 ركز جيداً...';

    ballIndex = Math.floor(Math.random() * 3);
    positions = [0, 1, 2];
    setBall(false);
    updatePositions();

    // إظهار الكرة أول مرة
    const startCup = positions.indexOf(ballIndex);
    cups[startCup].classList.add('visible');
    setTimeout(() => {
      cups[startCup].classList.remove('visible');
    }, 800);

    // بدء التحريك
    let moves = 0;
    const totalMoves = 14;
    const shuffleInterval = setInterval(() => {
      const i = Math.floor(Math.random() * 3);
      let j = Math.floor(Math.random() * 3);
      while (j === i) j = Math.floor(Math.random() * 3);

      const oldI = positions[i];
      const oldJ = positions[j];

      // نقل الكرة بصرياً أثناء التبديل (من i إلى j)
      // نضيف الكلاس visible للكوب الذي تنقل إليه الكرة فوراً
      const fromCup = cups[i];
      const toCup = cups[j];
      
      // إظهار الكرة في الكوب المصدر
      if (visibleIndex === i) {
        fromCup.classList.remove('visible');
        toCup.classList.add('visible');
        visibleIndex = j;
      }

      // تبديل المواضع
      [positions[i], positions[j]] = [positions[j], positions[i]];

      // حركة انزلاق
      const tempX = currentXPositions[i];
      currentXPositions[i] = currentXPositions[j];
      currentXPositions[j] = tempX;

      cups[i].style.transform = 'translateX(' + currentXPositions[i] + 'px)';
      cups[j].style.transform = 'translateX(' + currentXPositions[j] + 'px)';

      // تحديث فهرس الكرة
      if (ballIndex === oldI) ballIndex = oldJ;
      else if (ballIndex === oldJ) ballIndex = oldI;

      moves++;
      if (moves >= totalMoves) {
        clearInterval(shuffleInterval);
        isPlaying = false;
        isRevealed = false;
        // إخفاء الكرة نهائياً
        cups.forEach(cup => cup.classList.remove('visible'));
        statusText.textContent = '🕵️ خمن! تحت أي كوب الكرة؟';
        playBtn.textContent = '▶️ ابدأ';
      }
    }, 200);
  }

  function guess(index) {
    if (isPlaying || isRevealed) return;
    isRevealed = true;

    // إظهار الكرة عند الإجابة
    setBall(true, ballIndex);

    if (index === positions[ballIndex]) {
      statusText.textContent = '🎉 أحسنت! وجدت الكرة!';
      correct++;
      correctEl.textContent = correct;
    } else {
      statusText.textContent = '😢 خسارة! الكرة كانت هنا';
      wrong++;
      wrongEl.textContent = wrong;
    }
  }

  function resetGame() {
    ballIndex = 1;
    positions = [0, 1, 2];
    correct = 0;
    wrong = 0;
    isPlaying = false;
    isRevealed = false;
    setBall(false);
    updatePositions();
    statusText.textContent = 'اضغط "ابدأ" لتحريك الأكواب';
    playBtn.textContent = '▶️ ابدأ';
    correctEl.textContent = correct;
    wrongEl.textContent = wrong;
  }

  cups.forEach(cup => {
    cup.addEventListener('click', () => guess(parseInt(cup.dataset.index)));
  });
  playBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);

  resetGame();
})();
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Shell Game Handler
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
                  messageText: "🫙 URANOS Shell"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-shell-html",
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
    console.error('[URANOS SHELL ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة الكوب والكرة.');
  }
};

handler.help = ['كوب', 'كرة', 'shell', 'تخمين'];
handler.tags = ['tools', 'game'];
handler.command = ['كوب', 'كرة', 'shell', 'تخمين'];

export default handler;
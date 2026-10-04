// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: dino.js - لعبة الديناصور URANOS (نسخة شغالة بنفس نظام الكازينو)
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
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0, #d4d4d4);
  font-family: 'Courier New', monospace;
  overflow-x: hidden;
  min-height: 100vh;
  color: #333;
}
body {
  padding: 20px 0;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.sub {
  font-size: 12px;
  color: #777;
  margin-bottom: 15px;
}

/* --- صندوق اللعبة --- */
.game-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  border: 2px solid #999;
}

/* شاشة اللعبة (الكانفاس) */
.screen {
  background: #fafafa;
  border-radius: 10px;
  border: 2px solid #ccc;
  margin-bottom: 10px;
  position: relative;
}
canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* شريط النتائج */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* أزرار التحكم */
.controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
.ctrl-btn {
  background: #333;
  border: 2px solid #000;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 0 #000;
  transition: all 0.1s;
  font-family: 'Courier New', monospace;
}
.ctrl-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #000;
}
.ctrl-btn.jump { background: #3498db; border-color: #2980b9; box-shadow: 0 4px 0 #2980b9; }
.ctrl-btn.duck { background: #e74c3c; border-color: #c0392b; box-shadow: 0 4px 0 #c0392b; }

/* زر البدء الكبير 🦖 */
.start-btn {
  background: linear-gradient(180deg, #2ecc71, #27ae60);
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  padding: 15px;
  width: 100%;
  border-radius: 50px;
  border: 4px solid #27ae60;
  cursor: pointer;
  box-shadow: 0 6px 0 #1e8449, 0 10px 20px rgba(0,0,0,0.3);
  transition: all 0.1s;
  letter-spacing: 2px;
  outline: none;
  font-family: 'Courier New', monospace;
}
.start-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #1e8449, 0 5px 10px rgba(0,0,0,0.3);
}
</style>
</head>
<body>

<div class="title">🦖 URANOS DINO 🦖</div>
<div class="sub">اقفز فوق الصبّار وتجنب الطيور!</div>

<div class="game-container">
  <div class="screen">
    <canvas id="gameCanvas" width="400" height="200"></canvas>
  </div>

  <div class="scoreboard">
    <span>📍 النقاط: <span id="score">0</span></span>
    <span>🏆 الرقم القياسي: <span id="highScore">0</span></span>
  </div>

  <div class="controls">
    <button class="ctrl-btn jump" id="jumpBtn">⬆️ قفز</button>
    <button class="ctrl-btn duck" id="duckBtn">⬇️ انحناء</button>
  </div>

  <button class="start-btn" id="startBtn">🦖 START 🦖</button>
</div>

<script>
(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const startBtn = document.getElementById('startBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const duckBtn = document.getElementById('duckBtn');

  // إعدادات اللعبة
  const gravity = 0.6;
  const jumpPower = -14;
  const groundY = canvas.height - 30;
  const dinoWidth = 50;
  const dinoHeight = 50;

  let dino = { x: 40, y: groundY - dinoHeight, width: dinoWidth, height: dinoHeight, velocityY: 0, isJumping: false, isDucking: false };
  let obstacles = [];
  let score = 0;
  let highScore = 0;
  let gameLoop;
  let isGameOver = false;
  let speed = 6;
  let obstacleTimer = 0;
  let isRunning = false;

  // رسم الديناصور (نسخة بسيطة بمربعات)
  function drawDino() {
    ctx.fillStyle = '#2d2d2d';
    if (dino.isDucking) {
      // شكل منحني
      ctx.fillRect(dino.x, dino.y + 20, dino.width + 20, dino.height - 20);
      ctx.fillRect(dino.x + dino.width + 15, dino.y + 25, 15, 15); // رأس منحنٍ
    } else {
      // شكل واقف
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
      // عين وذراع
      ctx.fillStyle = '#fff';
      ctx.fillRect(dino.x + 30, dino.y + 10, 8, 8);
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(dino.x + 25, dino.y + 15, 15, 20);
    }
  }

  // رسم الصبّار (الأشواك)
  function drawObstacle(obstacle) {
    if (obstacle.type === 'cactus') {
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillRect(obstacle.x - 10, obstacle.y + 10, 10, obstacle.height - 10);
      ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 10, 10, obstacle.height - 10);
    } else {
      // طائر
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillRect(obstacle.x + obstacle.width, obstacle.y - 5, 15, obstacle.height);
      ctx.fillRect(obstacle.x - 15, obstacle.y - 5, 15, obstacle.height);
    }
  }

  // توليد العقبات
  function spawnObstacle() {
    const isBird = Math.random() < 0.3; // 30% طائر
    const height = isBird ? 30 : 40 + Math.random() * 20; // الطيور أقل ارتفاعاً
    const y = isBird ? groundY - dinoHeight - 10 - Math.random() * 30 : groundY - height;
    obstacles.push({
      x: canvas.width,
      y: y,
      width: isBird ? 30 : 20,
      height: height,
      type: isBird ? 'bird' : 'cactus'
    });
  }

  // التحقق من التصادم
  function checkCollision(obstacle) {
    const dinoBox = {
      x: dino.isDucking ? dino.x + 10 : dino.x,
      y: dino.isDucking ? dino.y + 20 : dino.y,
      w: dino.isDucking ? dino.width : dino.width - 10,
      h: dino.isDucking ? dino.height - 20 : dino.height
    };
    return dinoBox.x < obstacle.x + obstacle.width &&
           dinoBox.x + dinoBox.w > obstacle.x &&
           dinoBox.y < obstacle.y + obstacle.height &&
           dinoBox.y + dinoBox.h > obstacle.y;
  }

  // اللوب الرئيسي
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم الأرض
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, groundY, canvas.width, 2);

    // رسم الديناصور
    drawDino();

    // تحديث حركة الديناصور
    if (!dino.isDucking) {
      dino.velocityY += gravity;
      dino.y += dino.velocityY;
    }

    // منع النزول تحت الأرض
    if (dino.y >= groundY - dinoHeight) {
      dino.y = groundY - dinoHeight;
      dino.velocityY = 0;
      dino.isJumping = false;
    }

    // توليد العقبات تدريجياً
    obstacleTimer++;
    if (obstacleTimer > 50) {
      spawnObstacle();
      obstacleTimer = 0;
    }

    // تحديث العقبات وحذف البعيد منها
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed;
      drawObstacle(obstacles[i]);

      if (checkCollision(obstacles[i])) {
        return gameOver();
      }

      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
      }
    }

    // زيادة السرعة والنقاط
    speed += 0.002;
    score++;
    scoreEl.textContent = score;

    gameLoop = requestAnimationFrame(update);
  }

  function gameOver() {
    isGameOver = true;
    isRunning = false;
    cancelAnimationFrame(gameLoop);
    
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '14px Courier New';
    ctx.fillText('اضغط START للعب مجدداً', canvas.width / 2, canvas.height / 2 + 20);
    startBtn.textContent = '🦖 START 🦖';
  }

  function startGame() {
    cancelAnimationFrame(gameLoop);
    // إعادة الضبط
    dino.y = groundY - dinoHeight;
    dino.velocityY = 0;
    dino.isJumping = false;
    dino.isDucking = false;
    obstacles = [];
    score = 0;
    speed = 6;
    obstacleTimer = 0;
    scoreEl.textContent = score;
    isGameOver = false;
    isRunning = true;
    startBtn.textContent = '⏳ جاري اللعب...';
    update();
  }

  function jump() {
    if (dino.isJumping || isGameOver || !isRunning) return;
    dino.velocityY = jumpPower;
    dino.isJumping = true;
    dino.isDucking = false;
    dino.height = 50; // إنهاء الانحناء عند القفز
  }

  function duck() {
    if (isGameOver || !isRunning) return;
    if (!dino.isDucking) {
      dino.isDucking = true;
      dino.velocityY = 0; // إيقاف الجاذبية أثناء الانحناء
      dino.y = groundY - dinoHeight + 20; // التحرك لأسفل
      dino.height = 30; // تقصير الديناصور
    }
  }

  function standUp() {
    if (dino.isDucking) {
      dino.isDucking = false;
      dino.height = 50; // إرجاع الطول
      dino.y = groundY - dinoHeight; // إرجاع للأعلى
    }
  }

  // أزرار التحكم
  jumpBtn.addEventListener('click', jump);
  duckBtn.addEventListener('touchstart', function(e){ e.preventDefault(); duck(); }, {passive: false});
  duckBtn.addEventListener('touchend', function(e){ e.preventDefault(); standUp(); }, {passive: false});
  
  // دعم اللمس على الشاشة للقفز
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    jump();
  }, { passive: false });

  // بدء اللعبة
  startBtn.addEventListener('click', startGame);

  // الرسم الأولي
  startBtn.textContent = '🦖 START 🦖';
})();
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Dino Game Handler
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
                  messageText: "🦖 URANOS Dino"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-dino-html",
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
    console.error('[URANOS DINO ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة الديناصور.');
  }
};

// ============================================================
// ملاحظة مهمة: حذف النقطة (.) من الأوامر لجعلها تعمل بدون كتابة نقطة
// ============================================================
handler.help = ['ديناصور', 'dino', 'تكس', 'عبة جوجل'];
handler.tags = ['tools', 'game'];
handler.command = ['ديناصور', 'dino', 'تكس', 'جوجل']; // بدون نقطة (.) في البداية!

export default handler;
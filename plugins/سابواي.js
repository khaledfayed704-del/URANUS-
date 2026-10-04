// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: subway.js - لعبة Subway Surfers (نسخة 2D خفيفة لواتساب)
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
  background: linear-gradient(135deg, #1e3c72, #2a5298, #0f2027);
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
  color: #f5deb3;
  text-shadow: 0 3px 8px rgba(0,0,0,0.8);
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.sub {
  font-size: 13px;
  color: #ccc;
  margin-bottom: 15px;
}

/* --- صندوق اللعبة --- */
.game-container {
  position: relative;
  width: 90%;
  max-width: 350px;
  margin: 0 auto;
  background: #111;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,215,0,0.1);
  border: 3px solid #8b6914;
}

/* شاشة اللعبة */
.screen {
  background: #000;
  border-radius: 15px;
  border: 2px solid #444;
  margin-bottom: 15px;
  overflow: hidden;
}
canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  background: linear-gradient(180deg, #87CEEB, #fff 80%); /* سماء وبيئة */
}

/* شريط النتائج */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #222;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #444;
  font-size: 13px;
  margin-bottom: 12px;
}
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: none;
  z-index: 10;
}

/* أزرار التحكم والبدء */
.controls {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.ctrl-btn {
  background: #2a1a0a;
  border: 2px solid #8b6914;
  color: #f5deb3;
  padding: 12px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 0 #1a0a00;
  transition: all 0.1s;
  min-width: 60px;
}
.ctrl-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #1a0a00;
}

.start-btn {
  background: linear-gradient(180deg, #ffd700, #ff8c00);
  color: #1a0a00;
  font-size: 22px;
  font-weight: 900;
  padding: 15px;
  width: 100%;
  border-radius: 50px;
  border: 4px solid #ffd700;
  cursor: pointer;
  box-shadow: 0 6px 0 #b35a00, 0 10px 20px rgba(0,0,0,0.6);
  transition: all 0.1s;
  letter-spacing: 2px;
  outline: none;
}
.start-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #b35a00, 0 5px 10px rgba(0,0,0,0.6);
}

#instructions {
  font-size: 14px;
  margin-bottom: 15px;
  color: #f5deb3;
}
</style>
</head>
<body>

<div class="title">🏃 URANOS SUBWAY 🏃</div>
<div class="sub">اجمع القطع الذهبية وتفادى القطارات!</div>

<div class="game-container">
  <div class="screen" style="position: relative;">
    <canvas id="gameCanvas" width="400" height="600"></canvas>
    <div class="overlay" id="gameOverOverlay">
      <div style="font-size: 20px; font-weight: bold; color: red; margin-bottom: 10px;">انتهت اللعبة!</div>
      <div style="margin-bottom: 20px;">نقاطك: <span id="finalScore">0</span></div>
      <button class="start-btn" onclick="restartGame()" style="padding: 10px; font-size: 16px;">🔄 العب مجدداً</button>
    </div>
  </div>

  < _div class="scoreboard">
    <span>💰 النقاط: <span id="score">0</span></span>
    <span>🏆 الرقم القياسي: <span id="highScore">0</span></span>
  </div>

  <div id="instructions">✋ اسحب بإصبعك أو استخدم الأزرار</div>

  <div class="controls">
    <button class="ctrl-btn" id="leftBtn">⬅️</button>
    <button class="ctrl-btn" id="jumpBtn">⬆️</button>
    <button class="ctrl-btn" id="duckBtn">⬇️</button>
    <button class="ctrl-btn" id="rightBtn">➡️</button>
  </div>

  <button class="start-btn" id="startBtn">🏃 START 🏃</button>
</div>

<script>
(function() {
  // إعدادات اللعبة
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const gridSize = 100;
  const playerXPositions = [50, 150, 250]; // 3 مسارات
  const groundY = 480;
  
  let currentLane = 1; // الوسط
  let playerY = groundY;
  let velocityY = 0;
  let isJumping = false;
  let isDucking = false;
  let obstacles = [];
  let coins = [];
  let score = 0;
  let highScore = 0;
  let gameLoop;
  let speed = 6;
  let gameOver = false;
  let isRunning = false;

  // إحصائيات
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const startBtn = document.getElementById('startBtn');
  const finalScoreEl = document.getElementById('finalScore');
  const overlay = document.getElementById('gameOverOverlay');

  // هيكل اللاعب
  let player = {
    x: playerXPositions[1],
    y: groundY,
    width: 30,
    height: 60,
    color: '#e74c3c'
  };

  function resetGame() {
    obstacles = [];
    coins = [];
    score = 0;
    speed = 6;
    gameOver = false;
    currentLane = 1;
    playerY = groundY;
    velocityY = 0;
    isJumping = false;
    isDucking = false;
    player.x = playerXPositions[1];
    player.y = groundY;
    scoreEl.textContent = score;
    overlay.style.display = 'none';
  }

  function drawBackground() {
    // سماء وأرض
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, groundY - 20);
    ctx.fillStyle = '#8B4513'; // قضبان الحديد
    ctx.fillRect(0, groundY - 20, canvas.width, 20);
    // رسم خطوط المسار
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, groundY - 20);
    ctx.lineTo(100, canvas.height);
    ctx.moveTo(200, groundY - 20);
    ctx.lineTo(200, canvas.height);
    ctx.moveTo(300, groundY - 20);
    ctx.lineTo(300, canvas.height);
    ctx.stroke();
  }

  function drawPlayer() {
    ctx.fillStyle = player.color;
    if (isDucking) {
      ctx.fillRect(player.x, player.y + 20, player.width, player.height - 10);
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x + 10, player.y + 30, 5, 5);
    } else {
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x + 10, player.y + 10, 5, 5);
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 10, player.y + (isDucking ? 30 : 10), 4, 4);
  }

  function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    const type = Math.random() > 0.6 ? 'train' : 'barrier'; // قطار أو حاجز
    obstacles.push({
      x: lane * gridSize + (lane * gridSize === 0 ? 0 : 0),
      y: type === 'train' ? groundY - 80 : groundY - 40,
      width: type === 'train' ? 80 : 60,
      height: type === 'train' ? 80 : 40,
      type: type,
      lane: lane,
      passed: false
    });
  }

  function spawnCoin() {
    const lane = Math.floor(Math.random() * 3);
    coins.push({
      x: lane * gridSize + 35,
      y: groundY - 60,
      lane: lane,
      collected: false
    });
  }

  function update() {
    // حركة اللاعب (القفز)
    if (isJumping) {
      velocityY += 1;
      playerY += velocityY;
      if (playerY >= groundY) {
        playerY = groundY;
        velocityY = 0;
        isJumping = false;
      }
    }
    player.y = playerY;

    // توليد عوائق وعملات
    if (Math.random() < 0.03) spawnObstacle();
    if (Math.random() < 0.05) spawnCoin();

    // تحديث العوائق
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].y += speed;
      
      // فحص التصادم
      if (obstacles[i].lane === currentLane) {
        const playerBox = {
          x: player.x,
          y: player.y,
          w: player.width,
          h: player.height
        };
        const obsBox = {
          x: obstacles[i].x + 10,
          y: obstacles[i].y,
          w: obstacles[i].width,
          h: obstacles[i].height
        };
        
        if (playerBox.x < obsBox.x + obsBox.w &&
            playerBox.x + playerBox.w > obsBox.x &&
            playerBox.y < obsBox.y + obsBox.h &&
            playerBox.y + playerBox.h > obsBox.y) {
          
          // أسلوب المراوغة
          if (isDucking && obstacles[i].type === 'train' && playerBox.y + playerBox.h > obstacles[i].y + 50) {
            // نجا من القطار بالانحناء
          } else {
            gameOverFunc();
            return;
          }
        }
      }
      
      if (obstacles[i].y > canvas.height) {
        obstacles.splice(i, 1);
      }
    }

    // تحديث العملات
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].y += speed;
      if (coins[i].lane === currentLane && !coins[i].collected) {
        if (Math.abs(player.x - coins[i].x) < 30 && Math.abs(player.y - coins[i].y) < 50) {
          coins[i].collected = true;
          score += 10;
          scoreEl.textContent = score;
        }
      }
      if (coins[i].y > canvas.height) {
        coins.splice(i, 1);
      }
    }

    // رسم كل شيء
    drawBackground();
    
    // رسم العملات
    coins.forEach(coin => {
      if (!coin.collected) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
        ctx.strokeStyle = '#b8860b';
        ctx.stroke();
      }
    });

    // رسم العوائق
    obstacles.forEach(obs => {
      ctx.fillStyle = obs.type === 'train' ? '#2c3e50' : '#8e44ad';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      // تفاصيل إضافية
      ctx.fillStyle = '#fff';
      ctx.fillRect(obs.x + 10, obs.y + 10, 10, 10); // نافذة القطار
    });

    drawPlayer();

    // زيادة السرعة والنقاط
    speed += 0.005;
    score++;
    scoreEl.textContent = score;

    gameLoop = requestAnimationFrame(update);
  }

  function gameOverFunc() {
    gameOver = true;
    isRunning = false;
    cancelAnimationFrame(gameLoop);
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
    }
    finalScoreEl.textContent = score;
    overlay.style.display = 'block';
    startBtn.textContent = '🏃 START 🏃';
  }

  function startGame() {
    cancelAnimationFrame(gameLoop);
    resetGame();
    isRunning = true;
    startBtn.textContent = '⏳ جاري اللعب...';
    update();
  }

  // حركة اللاعب
  function moveLeft() {
    if (currentLane > 0) {
      currentLane--;
      player.x = playerXPositions[currentLane];
    }
  }
  function moveRight() {
    if (currentLane < 2) {
      currentLane++;
      player.x = playerXPositions[currentLane];
    }
  }
  function jump() {
    if (!isJumping) {
      isJumping = true;
      velocityY = -15;
      isDucking = false;
    }
  }
  function duck() {
    isDucking = true;
    isJumping = false;
    velocityY = 0;
    playerY = groundY + 20;
  }

  // أزرار التحكم
  document.getElementById('leftBtn').addEventListener('click', moveLeft);
  document.getElementById('rightBtn').addEventListener('click', moveRight);
  document.getElementById('jumpBtn').addEventListener('click', jump);
  document.getElementById('duckBtn').addEventListener('touchstart', duck);
  document.getElementById('duckBtn').addEventListener('touchend', function() { isDucking = false; playerY = groundY; });

  // دعم السحب باللمس
  let startX, startY;
  canvas.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let endX = e.touches[0].clientX;
    let endY = e.touches[0].clientY;
    let dx = endX - startX;
    let dy = endY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) moveRight();
      if (dx < -30) moveLeft();
    } else {
      if (dy < -30) jump();
      if (dy > 30) duck();
    }
    startX = endX;
    startY = endY;
  }, { passive: false });
  canvas.addEventListener('touchend', function() {
    isDucking = false;
    playerY = groundY;
  });

  // زر البداية
  startBtn.addEventListener('click', startGame);
  resetGame();
})();
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Subway Game Handler
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
                  messageText: "🏃 URANOS Subway"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-subway-html",
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
    console.error('[URANOS SUBWAY ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة السابواي.');
  }
};

// ============================================================
// ملاحظة مهمة: حذف النقطة (.) من الأوامر لجعلها تعمل بدون كتابة نقطة
// ============================================================
handler.help = ['سابواي', 'subway', 'مترو', 'قطار'];
handler.tags = ['tools', 'game'];
handler.command = ['سابواي', 'subway', 'مترو', 'قطار']; // بدون نقطة (.) في البداية!

export default handler
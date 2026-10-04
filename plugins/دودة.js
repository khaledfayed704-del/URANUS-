// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: snake.js - لعبة الدودة URANOS (نسخة بطيئة)
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
  color: #f5deb3;
  text-shadow: 0 3px 8px rgba(0,0,0,0.8);
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.sub {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 15px;
}

/* --- صندوق اللعبة --- */
.game-container {
  position: relative;
  width: 90%;
  max-width: 350px;
  margin: 0 auto;
  background: linear-gradient(180deg, #2a2a35, #14141c);
  border-radius: 25px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,215,0,0.1);
  border: 3px solid #8b6914;
}

/* شاشة اللعبة (الكانفاس) */
.screen {
  background: #000;
  border-radius: 12px;
  border: 2px solid #444;
  margin-bottom: 15px;
  box-shadow: inset 0 0 20px rgba(255,215,0,0.2);
  position: relative;
}
canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
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

/* أزرار التحكم */
.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}
.ctrl-btn {
  background: #2a1a0a;
  border: 2px solid #8b6914;
  color: #f5deb3;
  padding: 12px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 0 #1a0a00;
  transition: all 0.1s;
}
.ctrl-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #1a0a00;
}
.ctrl-btn.up { grid-column: 2; }
.ctrl-btn.left { grid-column: 1; grid-row: 2; }
.ctrl-btn.down { grid-column: 2; grid-row: 2; }
.ctrl-btn.right { grid-column: 3; grid-row: 2; }

/* زر البدء الكبير 🐍 */
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
</style>
</head>
<body>

<div class="title">🐍 URANOS SNAKE 🐍</div>
<div class="sub">استخدم الأزرار أو اسحب بإصبعك للتحكم</div>

<div class="game-container">
  <div class="screen">
    <canvas id="gameCanvas" width="300" height="300"></canvas>
  </div>

  <div class="scoreboard">
    <span>🍎 النقاط: <span id="score">0</span></span>
    <span>🏆 أطول دودة: <span id="highScore">0</span></span>
  </div>

  <div class="controls">
    <button class="ctrl-btn up" data-dir="up">⬆️</button>
    <button class="ctrl-btn left" data-dir="left">⬅️</button>
    <button class="ctrl-btn down" data-dir="down">⬇️</button>
    <button class="ctrl-btn right" data-dir="right">➡️</button>
  </div>

  <button class="start-btn" id="startBtn">🐍 START 🐍</button>
</div>

<script>
(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const startBtn = document.getElementById('startBtn');

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [];
  let direction = { x: 1, y: 0 };
  let food = {};
  let score = 0;
  let highScore = 0;
  let gameLoop;
  let isGameOver = false;
  let isRunning = false;

  function initGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreEl.textContent = score;
    placeFood();
    isGameOver = false;
  }

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    // التأكد من عدم وضع التفاحة فوق الدودة
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        placeFood();
        break;
      }
    }
  }

  function draw() {
    // رسم الخلفية
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم التفاحة (التفاحة الحمراء)
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f0';
    ctx.fillRect(food.x * gridSize + gridSize / 2 - 2, food.y * gridSize - 2, 4, 8); // ورقة التفاحة

    // رسم الدودة
    snake.forEach((segment, index) => {
      // الرأس لونه مختلف عن الجسم
      ctx.fillStyle = index === 0 ? '#5eff5e' : '#2ecc71'; 
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      // إضافة عيون للرأس
      if (index === 0) {
        ctx.fillStyle = '#000';
        if (direction.x === 1) { // يمين
          ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 4, 4, 4);
          ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 12, 4, 4);
        } else if (direction.x === -1) { // يسار
          ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 4, 4, 4);
          ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 12, 4, 4);
        } else if (direction.y === 1) { // أسفل
          ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 12, 4, 4);
          ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 12, 4, 4);
        } else { // أعلى
          ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 2, 4, 4);
          ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 2, 4, 4);
        }
      }
    });
  }

  function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // التحقق من اصطدام الجدار
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      return gameOver();
    }

    // التحقق من اصطدام الدودة بنفسها
    for (let segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return gameOver();
      }
    }

    snake.unshift(head);

    // التحقق من أكل التفاحة
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
  }

  function gameLoopFunc() {
    update();
    draw();
    if (!isGameOver) {
      // تم تغيير السرعة من 150 إلى 300 لجعل اللعبة أبطأ
      gameLoop = setTimeout(gameLoopFunc, 300); 
    }
  }

  function gameOver() {
    isGameOver = true;
    clearTimeout(gameLoop);
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff4d4d';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('انتهت اللعبة!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('اضغط START للعب مجدداً', canvas.width / 2, canvas.height / 2 + 20);
    isRunning = false;
    startBtn.textContent = '🐍 START 🐍';
  }

  function changeDirection(newDir) {
    // منع التحرك للاتجاه المعاكس
    if (newDir === 'up' && direction.y === 1) return;
    if (newDir === 'down' && direction.y === -1) return;
    if (newDir === 'left' && direction.x === 1) return;
    if (newDir === 'right' && direction.x === -1) return;
    
    if (newDir === 'up') direction = { x: 0, y: -1 };
    if (newDir === 'down') direction = { x: 0, y: 1 };
    if (newDir === 'left') direction = { x: -1, y: 0 };
    if (newDir === 'right') direction = { x: 1, y: 0 };
  }

  // أزرار التحكم
  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeDirection(btn.dataset.dir);
    });
  });

  // دعم السحب بالإصبع
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) changeDirection('right'); else changeDirection('left');
    } else {
      if (dy > 0) changeDirection('down'); else changeDirection('up');
    }
    touchStartX = touchEndX;
    touchStartY = touchEndY;
  }, { passive: false });

  // زر البداية
  startBtn.addEventListener('click', function() {
    clearTimeout(gameLoop);
    initGame();
    draw();
    isRunning = true;
    startBtn.textContent = '⏳ جاري اللعب...';
    gameLoopFunc();
  });

  // الرسم الأولي
  initGame();
  draw();
})();
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Snake Game Handler
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
                  messageText: "🐍 URANOS Snake"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-snake-html",
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
    console.error('[URANOS SNAKE ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة الدودة.');
  }
};

// ============================================================
// ملاحظة مهمة: حذف النقطة (.) من الأوامر لجعلها تعمل بدون كتابة نقطة
// ============================================================
handler.help = ['دودة', 'ثعبان', 'snake', 'لعبة'];
handler.tags = ['tools', 'game'];
handler.command = ['دودة', 'ثعبان', 'snake', 'أفعى']; // بدون نقطة (.) في البداية!

export default handler;
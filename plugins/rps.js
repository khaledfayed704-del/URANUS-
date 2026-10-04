// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: rps.js (حجرة، ورقة، مقص - Lynox Engine)
// ============================================================

const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Lynox RPS 🪨📄✂️</title>
<style>
:root {
  --bg: #111b21;
  --card: #202c33;
  --cell: #2a3942;
  --cell-hover: #354752;
  --line: #3b4a54;
  --text: #e9edef;
  --muted: #8696a0;
  --accent: #00a884;
  --shadow: 0 18px 50px rgba(0,0,0,.45);
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  min-height: 100vh;
  background: transparent;
  color: var(--text);
  font-family: var(--font);
  user-select: none;
  overflow: hidden;
}

.stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.card {
  width: 100%;
  max-width: 400px;
  background: rgba(17, 27, 33, 0.96);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 12px 14px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 12px;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--accent);
  font-weight: 700;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 9px rgba(37,211,102,.7);
}

.scores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 14px;
  text-align: center;
}

.score-box {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px 4px;
}

.score-title {
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 2px;
}

.score-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

.choices-area {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 16px 0;
}

.choice-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--cell);
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s, background 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.choice-btn:hover {
  background: var(--cell-hover);
  border-color: var(--muted);
}

.choice-btn:active {
  transform: scale(0.88);
}

.choice-btn.selected {
  border-color: var(--accent);
  background: rgba(0, 168, 132, 0.15);
  transform: scale(1.05);
}

.status {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  min-height: 28px;
  margin: 10px 0 12px;
  color: var(--accent);
  direction: ltr;
}

.result-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: var(--card);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid var(--line);
}

.result-badge .emoji {
  font-size: 32px;
}
.result-badge .vs {
  color: var(--muted);
  font-weight: 700;
  font-size: 14px;
}
.result-badge .label {
  font-size: 12px;
  color: var(--muted);
}

.reset-btn {
  width: 100%;
  border: 0;
  background: var(--accent);
  color: #071b16;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  padding: 12px 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.reset-btn:active {
  opacity: 0.7;
}

.footer {
  text-align: center;
  margin-top: 10px;
  font-size: 10px;
  color: var(--muted);
}
</style>
</head>
<body>

<main class="stage">
  <div class="card">
    <div class="header">
      <div class="title">🪨📄✂️ Lynox RPS</div>
      <div class="badge"><span class="dot"></span> ذكاء عشوائي</div>
    </div>

    <div class="scores">
      <div class="score-box">
        <div class="score-title">🧑 أنت</div>
        <div class="score-val" id="scorePlayer">0</div>
      </div>
      <div class="score-box">
        <div class="score-title">🤝 تعادل</div>
        <div class="score-val" id="scoreDraw">0</div>
      </div>
      <div class="score-box">
        <div class="score-title">🤖 البوت</div>
        <div class="score-val" id="scoreBot">0</div>
      </div>
    </div>

    <div class="result-badge" id="resultBadge">
      <div>
        <div class="label">أنت</div>
        <div class="emoji" id="playerEmoji">❓</div>
      </div>
      <div class="vs">⚡</div>
      <div>
        <div class="label">البوت</div>
        <div class="emoji" id="botEmoji">❓</div>
      </div>
    </div>

    <div class="status" id="status">✋ اختر حركتك!</div>

    <div class="choices-area">
      <button class="choice-btn" data-choice="rock">🪨</button>
      <button class="choice-btn" data-choice="paper">📄</button>
      <button class="choice-btn" data-choice="scissors">✂️</button>
    </div>

    <button class="reset-btn" id="resetScores">🔄 إعادة ضبط النقاط</button>
    <div class="footer">Lynox Engine — RPS v1.0</div>
  </div>
</main>

<script>
(() => {
  const statusEl = document.getElementById('status');
  const playerEmoji = document.getElementById('playerEmoji');
  const botEmoji = document.getElementById('botEmoji');
  const scorePlayerEl = document.getElementById('scorePlayer');
  const scoreBotEl = document.getElementById('scoreBot');
  const scoreDrawEl = document.getElementById('scoreDraw');
  const resetBtn = document.getElementById('resetScores');
  const choiceBtns = document.querySelectorAll('.choice-btn');

  const EMOJI_MAP = { rock: '🪨', paper: '📄', scissors: '✂️' };
  const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

  let scores = { player: 0, bot: 0, draw: 0 };
  let isPlaying = false;

  function updateUI() {
    scorePlayerEl.textContent = scores.player;
    scoreBotEl.textContent = scores.bot;
    scoreDrawEl.textContent = scores.draw;
  }

  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      } else {
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      }
      osc.start(now);
      osc.stop(now + 0.3);
    } catch(e) {}
  }

  function getBotChoice() {
    const keys = Object.keys(EMOJI_MAP);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function determineWinner(player, bot) {
    if (player === bot) return 'draw';
    if (BEATS[player] === bot) return 'player';
    return 'bot';
  }

  function handleChoice(e) {
    if (isPlaying) return;
    const playerChoice = e.currentTarget.dataset.choice;
    
    choiceBtns.forEach(btn => btn.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    playSound('click');

    const botChoice = getBotChoice();
    const winner = determineWinner(playerChoice, botChoice);

    playerEmoji.textContent = EMOJI_MAP[playerChoice];
    botEmoji.textContent = EMOJI_MAP[botChoice];

    let msg = '';
    if (winner === 'player') {
      scores.player++;
      msg = '🎉 فزت! أحسنت!';
      playSound('win');
    } else if (winner === 'bot') {
      scores.bot++;
      msg = '💔 خسرت! حاول مجدداً!';
      playSound('lose');
    } else {
      scores.draw++;
      msg = '🤝 تعادل! أعد المحاولة.';
      playSound('draw');
    }

    updateUI();
    statusEl.textContent = msg;
    isPlaying = true;
    setTimeout(() => {
      isPlaying = false;
      statusEl.textContent = '✋ اختر حركتك!';
      choiceBtns.forEach(btn => btn.classList.remove('selected'));
    }, 1200);
  }

  function resetScores() {
    scores = { player: 0, bot: 0, draw: 0 };
    updateUI();
    playerEmoji.textContent = '❓';
    botEmoji.textContent = '❓';
    statusEl.textContent = '🔄 تم التصفير! اختر حركتك.';
    choiceBtns.forEach(btn => btn.classList.remove('selected'));
    playSound('click');
    setTimeout(() => {
      if (!isPlaying) statusEl.textContent = '✋ اختر حركتك!';
    }, 800);
  }

  choiceBtns.forEach(btn => btn.addEventListener('click', handleChoice));
  resetBtn.addEventListener('click', resetScores);

  updateUI();
})();
</script>

</body>
</html>
`;

// Lynox Engine — RPS Handler
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
          botMetadata: {}
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: '🪨📄✂️ Lynox RPS'
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: 'lynox-rps-rich-html',
                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: 'GenAIaeacdsnwHtmlPrimitive',
                            payload: html,
                            trusted_sources: []
                          },
                          __typename: 'GenAISingleLayoutViewModel'
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
                  botJid: '867051314767696@bot'
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
    console.error('[RPS GAME ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة حجرة ورقة مقص.');
  }
};

handler.help = ['rps', 'حجرة', 'ورقة', 'مقص', 'حجرة_ورقة_مقص'];
handler.tags = ['game'];
handler.command = ['rps', 'حجرة', 'ورقة', 'مقص', 'حجرة_ورقة_مقص'];

export default handler;
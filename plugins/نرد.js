// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html,body{margin:0;padding:0;background:#0d1117;color:#fff;font-family:Arial,sans-serif;text-align:center}
body{padding:15px}
.card{width:100%;max-width:400px;margin:0 auto;background:#1e1e2e;border-radius:15px;padding:15px;border:2px solid #3a3a5c}
.title{font-size:24px;font-weight:900;color:#ffd75e;text-shadow:0 0 10px #ffd75e}
.scoreboard{display:flex;justify-content:space-between;background:#111;padding:10px;border-radius:10px;margin:10px 0;font-size:14px;font-weight:bold}

/* النرد المجسم */
.dice-area{display:flex;justify-content:center;margin:20px 0}
.dice-container{
width:100px;height:100px;perspective:400px;
}
.dice-cube{
width:100%;height:100%;position:relative;transform-style:preserve-3d;
background:#fff;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.3);
}
.dice-cube.rolling{
animation:rollDice 1.5s ease-in-out;
}
@keyframes rollDice{
0%{transform:rotateX(0) rotateY(0) rotateZ(0)}
25%{transform:rotateX(180deg) rotateY(90deg) rotateZ(0)}
50%{transform:rotateX(360deg) rotateY(180deg) rotateZ(0)}
75%{transform:rotateX(540deg) rotateY(270deg) rotateZ(0)}
100%{transform:rotateX(720deg) rotateY(360deg) rotateZ(0)}
}
.dice-face{
position:absolute;width:100%;height:100%;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;
}
.dice-face .dot{
width:16px;height:16px;border-radius:50%;background:#000;
}
.dice-face .dot.center{position:absolute}

/* الأوجه */
.face-1{transform:translateZ(50px)}
.face-2{transform:rotateY(180deg) translateZ(50px)}
.face-3{transform:rotateY(90deg) translateZ(50px)}
.face-4{transform:rotateY(-90deg) translateZ(50px)}
.face-5{transform:rotateX(90deg) translateZ(50px)}
.face-6{transform:rotateX(-90deg) translateZ(50px)}

/* شبكة النقاط */
.dots{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);width:60px;height:60px;align-items:center;justify-items:center}
.dot-empty{visibility:hidden}
.dot-fill{width:16px;height:16px;border-radius:50%;background:#111}
</style>
</head>
<body>

<div class="card">
<div class="title">🎲 DICE GAME</div>
<div class="scoreboard">
<span>✨ النقاط: <span id="score">0</span></span>
<span>🏆 الأعلى: <span id="best">0</span></span>
</div>

<div class="dice-area">
<div class="dice-container">
<div class="dice-cube" id="dice">
<!-- الوجه 1 -->
<div class="dice-face face-1">
<div class="dots"><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div></div>
</div>
<!-- الوجه 2 -->
<div class="dice-face face-2">
<div class="dots"><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-fill"></div></div>
</div>
<!-- الوجه 3 -->
<div class="dice-face face-3">
<div class="dots"><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-fill"></div></div>
</div>
<!-- الوجه 4 -->
<div class="dice-face face-4">
<div class="dots"><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div></div>
</div>
<!-- الوجه 5 -->
<div class="dice-face face-5">
<div class="dots"><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div></div>
</div>
<!-- الوجه 6 -->
<div class="dice-face face-6">
<div class="dots"><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div><div class="dot-fill"></div><div class="dot-empty"></div><div class="dot-fill"></div></div>
</div>
</div>
</div>
</div>

<button class="btn" id="rollBtn">🎲 ارمِ النرد</button>
</div>

<script>
(function(){
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');
var rollBtn = document.getElementById('rollBtn');
var dice = document.getElementById('dice');
var score = 0, best = 0;

function rollDice(){
dice.classList.add('rolling');

setTimeout(function(){
dice.classList.remove('rolling');
var num = Math.floor(Math.random() * 6) + 1;
// تغيير زاوية النرد ليبقى عند الوجه الصحيح
if(num === 1){ dice.style.transform = 'translateZ(50px)'; }
else if(num === 2){ dice.style.transform = 'rotateY(180deg) translateZ(50px)'; }
else if(num === 3){ dice.style.transform = 'rotateY(90deg) translateZ(50px)'; }
else if(num === 4){ dice.style.transform = 'rotateY(-90deg) translateZ(50px)'; }
else if(num === 5){ dice.style.transform = 'rotateX(90deg) translateZ(50px)'; }
else if(num === 6){ dice.style.transform = 'rotateX(-90deg) translateZ(50px)'; }

score += num;
document.getElementById('score').textContent = score;
if(score > best){ best = score; document.getElementById('best').textContent = best; }
}, 1500);
}

rollBtn.addEventListener('click', rollDice);
})();
</script>
</body>
</html>`;

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
                  messageText: '🎲 Dice Game'
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: 'uranos-dice-html',
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
    console.error('[DICE GAME ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة النرد.');
  }
};

handler.help = ['نرد', 'dice'];
handler.tags = ['game'];
handler.command = ['نرد', 'dice'];

export default handler;
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: cube3d.js - لعبة المكعب ثلاثي الأبعاد (CSS فقط)
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
  color: #fff;
  text-align: center;
}
body {
  padding: 15px;
}
.card {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  background: #1a1a2e;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  border: 3px solid #00d4a8;
}
.title {
  font-size: 24px;
  font-weight: 900;
  color: #00d4a8;
  text-shadow: 0 0 20px rgba(0, 212, 168, 0.4);
  margin-bottom: 10px;
}

/* ==== 3D Box (CSS Only) ==== */
/* الإطار (Perspective) */
.viewport {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 15px auto;
  perspective: 600px;
}

/* المكعب */
.cube {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(-30deg) rotateY(45deg);
  /* حركة تلقائية */
  animation: rotateCube 6s infinite linear;
}

/* 6 وجوه للمكعب */
.face {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #fff;
}

/* تحديد الأوجه */
.face-front {
  transform: translateZ(50px);
  background: rgba(0, 212, 168, 0.5);
}
.face-back {
  transform: rotateY(180deg) translateZ(50px);
  background: rgba(255, 82, 82, 0.5);
}
.face-left {
  transform: rotateY(-90deg) translateZ(50px);
  background: rgba(83, 189, 235, 0.5);
}
.face-right {
  transform: rotateY(90deg) translateZ(50px);
  background: rgba(255, 167, 38, 0.5);
}
.face-top {
  transform: rotateX(90deg) translateZ(50px);
  background: rgba(186, 104, 200, 0.5);
}
.face-bottom {
  transform: rotateX(-90deg) translateZ(50px);
  background: rgba(0, 168, 132, 0.5);
}

/* ==== حركة الدوران ==== */
@keyframes rotateCube {
  0%   { transform: translate(-50%, -50%) rotateX(0deg) rotateY(0deg); }
  100% { transform: translate(-50%, -50%) rotateX(360deg) rotateY(360deg); }
}

/* ==== الشاشة الأساسية ==== */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #161b22;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}
</style>
</head>
<body>

<div class="card">
  <div class="title">🎲 3D CUBE GAME</div>

  <div class="viewport">
    <div class="cube">
      <div class="face face-front"></div>
      <div class="face face-back"></div>
      <div class="face face-left"></div>
      <div class="face face-right"></div>
      <div class="face face-top"></div>
      <div class="face face-bottom"></div>
    </div>
  </div>

  <div class="scoreboard">
    <span>🎮 لعبة 3D</span>
    <span>💎 خلفية زجاجية</span>
    <span>🔄 حركة تلقائية</span>
  </div>
</div>

</body>
</html>`;

// ============================================================
// URANOS Engine — 3D Cube Handler
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
                  messageText: "🎲 3D Cube Game"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-cube-3d",
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
    console.error('[3D CUBE ERROR]', e);
    await m.reply('❌ فشل إرسال لعبة المكعب.');
  }
};

handler.help = ['مكعب', 'cube', '3d'];
handler.tags = ['tools', 'game'];
handler.command = ['مكعب', 'cube', '3d'];

export default handler;
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: sandwich.js - سندويشة الخبز الفرنسي (JavaScript)
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
  background: #161b22;
  border-radius: 15px;
  padding: 15px;
  border: 2px solid #ffcc00;
}
.title {
  font-size: 24px;
  font-weight: 900;
  color: #ffcc00;
  text-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
  margin-bottom: 10px;
}

/* ==== خبز الباجيت (🥖) ==== */
.baguette {
  width: 100%;
  height: 250px;
  background: linear-gradient(180deg, #f5d742, #d4a017);
  border-radius: 50% 50% 20% 20%;
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
}

/* ==== المكونات ==== */
.ingredients {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}
.ingredient-btn {
  background: #30363d;
  border: 2px solid #555;
  color: #fff;
  font-size: 30px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}
.ingredient-btn:active {
  background: #ffcc00;
}

/* ==== السندويشة ==== */
.sandwich-content {
  position: absolute;
  top: 20px;
  left: 10px;
  right: 10px;
  height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.layer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  padding: 4px;
}
</style>
</head>
<body>

<div class="card">
  <div class="title">🥖 سندويشة 🥖</div>

  <div class="baguette">
    <div class="sandwich-content" id="sandwichContent"></div>
  </div>

  <div class="ingredients">
    <button class="ingredient-btn" onclick="addLayer('🧀')">🧀</button>
    <button class="ingredient-btn" onclick="addLayer('🥬')">🥬</button>
    <button class="ingredient-btn" onclick="addLayer('🥩')">🥩</button>
    <button class="ingredient-btn" onclick="addLayer('🍅')">🍅</button>
    <button class="ingredient-btn" onclick="addLayer('🧅')">🧅</button>
    <button class="ingredient-btn" onclick="addLayer('🥚')">🥚</button>
    <button class="ingredient-btn" onclick="addLayer('🧂')">🧂</button>
    <button class="ingredient-btn" onclick="addLayer('🌶️')">🌶️</button>
  </div>

  <button style="width:100%;padding:12px;border-radius:8px;background:#ffcc00;color:#000;font-weight:bold;border:none;" onclick="resetSandwich()">🔄 إعادة السندويشة</button>
</div>

<script>
function addLayer(ingredient) {
  const sandwichContent = document.getElementById('sandwichContent');
  
  // إذا كانت السندويشة ممتلئة، توقف
  if (sandwichContent.children.length >= 8) {
    return;
  }
  
  const layer = document.createElement('div');
  layer.className = 'layer';
  layer.textContent = ingredient;
  sandwichContent.appendChild(layer);
}

function resetSandwich() {
  const sandwichContent = document.getElementById('sandwichContent');
  sandwichContent.innerHTML = '';
}
</script>

</body>
</html>`;

// ============================================================
// URANOS Engine — Sandwich Handler
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
                  messageText: "🥖 سندويشة"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "uranos-sandwich",
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
    console.error('[SANDWICH ERROR]', e);
    await m.reply('❌ فشل إرسال السندويشة.');
  }
};

handler.help = ['سندويشة'];
handler.tags = ['tools', 'fun'];
handler.command = ['سندويشة'];

export default handler;
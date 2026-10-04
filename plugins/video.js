// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: video.js - مشغل فيديو (Lynox Engine)
// ============================================================

const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Lynox Video Player 🎬</title>
<style>
:root {
  --bg: #111b21;
  --card: #202c33;
  --cell: #2a3942;
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
  max-width: 420px;
  background: rgba(17, 27, 33, 0.96);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 14px;
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
  font-size: 17px;
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

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  aspect-ratio: 16 / 9;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.video-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;
}

.control-btn {
  background: var(--cell);
  border: 1px solid var(--line);
  color: var(--text);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
}

.control-btn:active {
  transform: scale(0.90);
  background: var(--cell-hover);
}

.control-btn.play-btn {
  width: 56px;
  height: 56px;
  font-size: 28px;
  background: var(--accent);
  color: #071b16;
  border-color: var(--accent);
}

.control-btn.play-btn:active {
  opacity: 0.8;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--line);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: var(--accent);
  border-radius: 4px;
  transition: width 0.1s linear;
}

.time-display {
  font-size: 12px;
  color: var(--muted);
  min-width: 80px;
  text-align: center;
  direction: ltr;
}

.url-input-area {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 8px;
}

.url-input-area input {
  flex: 1;
  background: var(--cell);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 13px;
  outline: none;
  font-family: var(--font);
}

.url-input-area input::placeholder {
  color: var(--muted);
}

.url-input-area input:focus {
  border-color: var(--accent);
}

.url-input-area button {
  background: var(--accent);
  border: 0;
  color: #071b16;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}

.url-input-area button:active {
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
      <div class="title">🎬 Lynox Player</div>
      <div class="badge"><span class="dot"></span> تشغيل مباشر</div>
    </div>

    <div class="video-wrapper">
      <video id="videoPlayer" playsinline></video>
    </div>

    <div class="video-controls">
      <button class="control-btn" id="rewindBtn" title="رجوع 10 ثوان">⏪</button>
      <button class="control-btn play-btn" id="playBtn">▶️</button>
      <button class="control-btn" id="forwardBtn" title="تقدم 10 ثوان">⏩</button>
    </div>

    <div style="display:flex;align-items:center;gap:12px;padding:0 4px;">
      <div class="progress-bar" id="progressBar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <div class="time-display" id="timeDisplay">00:00 / 00:00</div>
    </div>

    <div class="url-input-area">
      <input type="text" id="videoUrlInput" placeholder="أدخل رابط الفيديو (mp4, webm, m3u8...)">
      <button id="loadBtn">⏯ تحميل</button>
    </div>

    <div class="footer">Lynox Engine — Video Player v1.0</div>
  </div>
</main>

<script>
(() => {
  const video = document.getElementById('videoPlayer');
  const playBtn = document.getElementById('playBtn');
  const rewindBtn = document.getElementById('rewindBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const timeDisplay = document.getElementById('timeDisplay');
  const urlInput = document.getElementById('videoUrlInput');
  const loadBtn = document.getElementById('loadBtn');

  let isDragging = false;

  // ربط الفيديو بالعناصر
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateProgress() {
    if (!isDragging) {
      const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      progressFill.style.width = percent + '%';
    }
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  function togglePlay() {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function updatePlayButton() {
    playBtn.textContent = video.paused ? '▶️' : '⏸️';
  }

  // أحداث الفيديو
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', updateProgress);
  video.addEventListener('ended', () => {
    playBtn.textContent = '▶️';
    progressFill.style.width = '0%';
  });

  // أزرار التحكم
  playBtn.addEventListener('click', togglePlay);

  rewindBtn.addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  });

  forwardBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  });

  // شريط التقدم
  progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
    updateProgress();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      video.currentTime = percent * video.duration;
      updateProgress();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      updateProgress();
    }
  });

  // دعم اللمس
  progressBar.addEventListener('touchstart', (e) => {
    isDragging = true;
    const rect = progressBar.getBoundingClientRect();
    const touch = e.touches[0];
    const percent = (touch.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
    updateProgress();
  }, { passive: true });

  progressBar.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const rect = progressBar.getBoundingClientRect();
      const touch = e.touches[0];
      const percent = Math.min(1, Math.max(0, (touch.clientX - rect.left) / rect.width));
      video.currentTime = percent * video.duration;
      updateProgress();
    }
  }, { passive: true });

  progressBar.addEventListener('touchend', () => {
    isDragging = false;
    updateProgress();
  }, { passive: true });

  // تحميل الفيديو من الرابط
  function loadVideo(url) {
    if (!url || url.trim() === '') {
      alert('❗ الرجاء إدخال رابط الفيديو.');
      return;
    }
    video.src = url.trim();
    video.load();
    video.play().catch(() => {});
    updateProgress();
  }

  loadBtn.addEventListener('click', () => {
    loadVideo(urlInput.value);
  });

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loadVideo(urlInput.value);
    }
  });

  // تحميل الفيديو الافتراضي إذا كان هناك رابط في الـ URL
  // (يمكن للمستخدم لصق الرابط يدوياً)
  // نضع رابطاً تجريبياً للتوضيح
  urlInput.placeholder = 'مثال: https://files.catbox.moe/569pll.mp4';

  // بدء الفيديو تلقائياً إذا كان الرابط موجوداً مسبقاً (اختياري)
  // يمكن تفعيل السطر التالي لتحميل فيديو افتراضي عند فتح الصفحة
  // loadVideo('https://files.catbox.moe/569pll.mp4');
})();
</script>

</body>
</html>
`;

// Lynox Engine — Video Player Handler
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
                  messageText: '🎬 Lynox Video Player'
                }
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: 'lynox-video-rich-html',
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
    console.error('[VIDEO PLAYER ERROR]', e);
    await m.reply('❌ فشل إرسال مشغل الفيديو.');
  }
};

handler.help = ['video', 'فيديو', 'player'];
handler.tags = ['tools'];
handler.command = ['video', 'فيديو', 'player', 'مشغل'];

export default handler;
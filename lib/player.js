/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import sharp from 'sharp';

export function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function getThumb(url) {
  try {
    if (!url) return Buffer.alloc(0);
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    
    const raw = Buffer.from(await res.arrayBuffer());
    return await sharp(raw)
      .resize(250, 250, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 50 })
      .toBuffer();
  } catch {
    return Buffer.alloc(0);
  }
}

export async function createHighQualityThumbnail(conn, thumb) {
  return null;
}

export function createMusicPlayer({ title, artist, duration, audioSrc, imageSrc, lyrics }) {
  const safeTitle = escapeHtml(title);
  const safeArtist = escapeHtml(artist);
  const safeDuration = escapeHtml(duration || '0:00');
  const safeImage = imageSrc || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMGQxmatePC9zdmc+';
  const lyricsJson = Buffer.from(JSON.stringify(lyrics || []), 'utf8').toString('base64');

  return `
<style>
  :root { --ink: #ffffff; --muted: #b9b1b6; --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { background: transparent; color: var(--ink); font-family: var(--sys); min-height: 100vh; }
  .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px 12px; }
  .player { position: relative; width: 100%; max-width: 330px; border-radius: 18px; overflow: hidden; background: #1a0d12; box-shadow: 0 18px 40px rgba(0,0,0,.5); }
  .bg { position: absolute; inset: -30%; width: 160%; height: 160%; object-fit: cover; filter: blur(38px) saturate(1.5); opacity: .85; z-index: 0; }
  .veil { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(20,8,12,.55) 0%, rgba(20,8,12,.72) 45%, rgba(12,5,8,.94) 100%); }
  .content { position: relative; z-index: 2; padding: 16px 18px 20px; }
  .lyrics-panel { position: absolute; inset: 0; z-index: 10; background: rgba(12,5,8,.96); backdrop-filter: blur(18px); display: flex; flex-direction: column; padding: 20px; transform: translateY(100%); transition: transform .35s cubic-bezier(.4,0,.2,1); }
  .lyrics-panel.is-open { transform: translateY(0); }
  .lyrics-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-weight: 600; font-size: 14px; letter-spacing: 1px; }
  .lyrics-status { font-size: 9px; color: var(--muted); margin-top: 4px; }
  .lyrics-close { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; }
  .lyrics-text { flex: 1; overflow-y: auto; font-size: 15px; line-height: 1.35; text-align: center; padding: 35vh 5px 35vh; scroll-behavior: smooth; }
  .lyric-line { display: block; color: rgba(255,255,255,.32); font-size: 15px; font-weight: 500; line-height: 1.5; padding: 7px 4px; margin: 2px 0; opacity: .65; transition: all .25s ease; }
  .lyric-line.is-past { color: rgba(255,255,255,.55); opacity: .72; }
  .lyric-line.is-active { color: #ffffff; opacity: 1; transform: scale(1.06); font-weight: 700; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
  .head__mid { text-align: center; flex: 1; min-width: 0; }
  .head__from { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .head__album { font-size: 12px; font-weight: 600; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .poster { width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: rgba(255,255,255,.06); box-shadow: 0 12px 26px rgba(0,0,0,.45); margin-bottom: 18px; }
  .poster img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .info { text-align: center; margin-bottom: 12px; }
  .info__title { font-size: 17px; font-weight: 700; letter-spacing: -.3px; line-height: 1.25; }
  .info__artist { font-size: 13px; font-weight: 500; color: var(--muted); margin-top: 2px; }
  .meta { display: flex; justify-content: center; gap: 12px; font-size: 11px; color: var(--muted); margin: 4px 0 12px; }
  .controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 6px 0 10px; }
  .controls button { background: rgba(255,255,255,.08); border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; cursor: pointer; transition: .2s; }
  .controls button:active { transform: scale(.9); }
  .controls .play-btn { width: 56px; height: 56px; background: #fff; color: #1a0d12; font-size: 24px; box-shadow: 0 6px 18px rgba(255,255,255,.2); }
  .seek { display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--muted); margin: 4px 0 8px; }
  .seek input { flex: 1; height: 3px; -webkit-appearance: none; background: rgba(255,255,255,.2); border-radius: 3px; outline: none; }
  .seek input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; }
  .bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
  .bottom .lyrics-btn { font-size: 12px; font-weight: 600; color: var(--muted); background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: 20px; background: rgba(255,255,255,.06); }
  .bottom .lyrics-btn.active { color: #fff; background: rgba(255,255,255,.12); }
  .bottom .via { font-size: 9px; color: rgba(255,255,255,.2); letter-spacing: .2px; }
  audio { display: none; }
</style>
<div class="wrap">
  <div class="player">
    <img class="bg" src="${safeImage}" alt="">
    <div class="veil"></div>
    <div class="content">
      <!-- Poster -->
      <div class="poster"><img src="${safeImage}" alt="${safeTitle}"></div>
      <!-- Info -->
      <div class="info">
        <div class="info__title">${safeTitle}</div>
        <div class="info__artist">${safeArtist}</div>
        <div class="meta"><span>${safeDuration}</span></div>
      </div>
      <!-- Controls -->
      <div class="controls">
        <button class="prev-btn">⏮</button>
        <button class="play-btn">▶</button>
        <button class="next-btn">⏭</button>
      </div>
      <div class="seek">
        <span class="current-time">0:00</span>
        <input type="range" min="0" max="100" value="0" class="seek-bar">
        <span class="total-time">${safeDuration}</span>
      </div>
      <div class="bottom">
        <button class="lyrics-btn" onclick="toggleLyrics()">📜 Lyrics</button>
        <span class="via">⚡ PLAY2</span>
      </div>
    </div>
    <!-- Lyrics Panel -->
    <div class="lyrics-panel" id="lyricsPanel">
      <div class="lyrics-head">
        <span>📜 LYRICS</span>
        <div class="lyrics-close" onclick="toggleLyrics()">✕</div>
      </div>
      <div class="lyrics-text" id="lyricsText"></div>
    </div>
  </div>
</div>
<audio id="audioPlayer" src="${audioSrc}"></audio>
<script>
  // بيانات الأغاني والكلمات
  const lyricsData = JSON.parse(atob('${lyricsJson}'));
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.querySelector('.play-btn');
  const seekBar = document.querySelector('.seek-bar');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const lyricsText = document.getElementById('lyricsText');
  const lyricsPanel = document.getElementById('lyricsPanel');

  let isPlaying = false;
  let lyricsVisible = false;
  let currentLyricIndex = -1;

  // تعبئة الكلمات
  function renderLyrics() {
    if (!lyricsData || !lyricsData.length) {
      lyricsText.innerHTML = '<div style="color:rgba(255,255,255,.3);padding:20px;font-size:13px;">No lyrics available</div>';
      return;
    }
    let html = '';
    lyricsData.forEach((line, idx) => {
      html += \`<div class="lyric-line" data-index="\${idx}" data-time="\${line.time}">\${escapeHtml(line.text)}</div>\`;
    });
    lyricsText.innerHTML = html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // تحديث الكلمات حسب الوقت
  function updateLyrics(time) {
    if (!lyricsData || !lyricsData.length) return;
    let activeIdx = -1;
    for (let i = lyricsData.length - 1; i >= 0; i--) {
      if (time >= lyricsData[i].time) { activeIdx = i; break; }
    }
    if (activeIdx === currentLyricIndex) return;
    currentLyricIndex = activeIdx;
    const lines = document.querySelectorAll('.lyric-line');
    lines.forEach((el, idx) => {
      el.classList.remove('is-past', 'is-active');
      if (idx < activeIdx) el.classList.add('is-past');
      else if (idx === activeIdx) el.classList.add('is-active');
    });
    if (activeIdx >= 0 && lyricsVisible) {
      const activeEl = lines[activeIdx];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  // تبديل لوحة الكلمات
  window.toggleLyrics = function() {
    lyricsVisible = !lyricsVisible;
    lyricsPanel.classList.toggle('is-open', lyricsVisible);
    if (lyricsVisible && lyricsData && lyricsData.length) {
      setTimeout(() => {
        const activeEl = document.querySelector('.lyric-line.is-active');
        if (activeEl) activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 400);
    }
  };

  // تشغيل/إيقاف
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸';
      isPlaying = true;
    } else {
      audio.pause();
      playBtn.textContent = '▶';
      isPlaying = false;
    }
  });

  // تحديث الوقت
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    seekBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    updateLyrics(audio.currentTime);
  });

  // شريط التقدم
  seekBar.addEventListener('input', () => {
    if (!audio.duration) return;
    const time = (seekBar.value / 100) * audio.duration;
    audio.currentTime = time;
    currentTimeEl.textContent = formatTime(time);
  });

  // نهاية الأغنية
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    isPlaying = false;
    audio.currentTime = 0;
    seekBar.value = 0;
    currentTimeEl.textContent = '0:00';
    renderLyrics();
    currentLyricIndex = -1;
  });

  // تحميل البيانات
  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return \`\${m}:\${String(s).padStart(2, '0')}\`;
  }

  // تهيئة الكلمات
  renderLyrics();

  // أزرار التخطي (demo)
  document.querySelector('.prev-btn').addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  document.querySelector('.next-btn').addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  // تحسين التمرير للكلمات
  console.log('🎵 PLAY2 loaded!');
</script>
`;
}
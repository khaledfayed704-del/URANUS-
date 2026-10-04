// plugins/ytplay.js
// ✧ ✧𝐅𝐀𝐍𝐈𝐓𝐀𝐒_𝐁𝐎𝐓 - مشغل فيديو يوتيوب 🎬

import crypto from 'crypto';
import { randomUUID } from 'crypto';
import axios from 'axios';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


class SaveTube {
    constructor() {
        this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        this.fmt = ['144', '240', '360', '480', '720', '1080', 'mp3'];
        this.re = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;
        this.ua = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36';
        this.maxTry = 4;
    }

    decode(enc) {
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const ct = data.slice(16);
        const key = Buffer.from(this.ky, 'hex');
        const dc = crypto.createDecipheriv('aes-128-cbc', key, iv);
        return JSON.parse(Buffer.concat([dc.update(ct), dc.final()]).toString());
    }

    async getCdn() {
        const res = await axios.get('https://media.savetube.vip/api/random-cdn', { timeout: 10000 });
        return res.data.cdn;
    }

    async sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    cleanTitle(raw = '') {
        let t = String(raw);
        const lp = /lyrics?|official\s*(music\s*)?video|audio|visualizer|mv|m\/v|hd|4k|8k|full\s*song|original\s*mix|remaster(ed)?|live|cover|clean|explicit|extended|radio\s*edit|slowed|reverb|sped\s*up|color\s*coded|sub\s*indo|terjemahan|lyric\s*video/i;
        t = t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '');
        t = t.replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, m => (lp.test(m) ? '' : m));
        t = t.replace(/\/\/+/g, ' - ').replace(/[|:]{1,2}/g, ' ').replace(/[#@]\S+/g, '');
        t = t.replace(new RegExp(`\\b(${lp.source})\\b`, 'gi'), '');
        t = t.replace(/\s{2,}/g, ' ').replace(/\s+-\s*$/g, '').replace(/^\s*-\s+/g, '').trim();
        return t || String(raw).trim();
    }

    async download(url, format = 'mp3') {
        const id = url.match(this.re)?.[3];
        if (!id) throw new Error('تعذر اسبوتيفايبوتيفايتخراج معرّف الفيديو (Video ID)');
        if (!this.fmt.includes(format)) throw new Error(`صيغة غير مدعومة: ${this.fmt.join(', ')}`);
        let lastErr = null;
        for (let attempt = 1; attempt <= this.maxTry; attempt++) {
            try {
                const cdn = await this.getCdn();
                const infoRes = await axios.post(
                    `https://${cdn}/v2/info`,
                    { url: `https://www.youtube.com/watch?v=${id}` },
                    { timeout: 15000, headers: { 'User-Agent': this.ua, Referer: 'https://save-tube.com/' } }
                );
                const info = this.decode(infoRes.data.data);
                const dlRes = await axios.post(
                    `https://${cdn}/download`,
                    {
                        downloadType: format === 'mp3' ? 'audio' : 'video',
                        quality: format === 'mp3' ? '128' : format,
                        key: info.key
                    },
                    {
                        timeout: 30000,
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Agent': this.ua,
                            Referer: 'https://save-tube.com/'
                        }
                    }
                );
                const dlUrl = dlRes.data?.data?.downloadUrl;
                if (!dlUrl) throw new Error('تعذر العثور على رابط التحميل المباشر');
                return {
                    title: this.cleanTitle(info.title),
                    rawTitle: info.title,
                    thumb: info.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                    duration: info.duration,
                    format,
                    url: dlUrl
                };
            } catch (e) {
                lastErr = e;
                if (attempt < this.maxTry) await this.sleep(800 * attempt);
            }
        }
        throw new Error(`SaveTube فشل: ${lastErr?.message}`);
    }
}

const st = new SaveTube();
const innertubeKey = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const innertubeUa = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function findVideoRenderer(node, out) {
    if (!node || typeof node !== 'object') return;
    if (node.videoRenderer?.videoId) {
        out.push(node.videoRenderer);
        return;
    }
    for (const key in node) findVideoRenderer(node[key], out);
}

async function searchYoutube(q) {
    if (/^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\//.test(q)) return q;
    const res = await fetch(`https://www.youtube.com/youtubei/v1/search?key=${innertubeKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': innertubeUa,
            'X-Youtube-Client-Name': '1',
            'X-Youtube-Client-Version': '2.20240101.00.00'
        },
        body: JSON.stringify({
            context: { client: { clientName: 'WEB', clientVersion: '2.20240101.00.00', hl: 'ar', gl: 'YE' } },
            query: q
        }),
        signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error(`فشل البحث في يوتيوب HTTP ${res.status}`);
    const json = await res.json();
    const found = [];
    findVideoRenderer(json.contents, found);
    if (!found.length) throw new Error('لم يتم العثور على أي مقطع');
    return `https://www.youtube.com/watch?v=${found[0].videoId}`;
}

async function getYoutubeDirectUrl(url, format = '360') {
    const formats = [format, '480', '720', '240', '144'].filter((v, i, a) => a.indexOf(v) === i);
    let lastError = null;
    for (const fmt of formats) {
        try {
            const res = await st.download(url, fmt);
            if (res?.url) return res;
        } catch (e) {
            lastError = e;
        }
    }
    throw lastError || new Error('فشل جلب رابط الفيديو المباشر');
}

function escapeHtmlJs(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\`/g, '\\`') 
        .replace(/\$\{/g, '\\${')
        .replace(/</g, '\\x3C');
}

function buildPlayerHtml({ title, channel, duration, videoUrl, wsUrl, posterBase64 }) {
    const safeTitle = escapeHtmlJs(title);
    const safeChannel = escapeHtmlJs(channel);
    const safeDuration = escapeHtmlJs(duration);
    const safeVideoUrl = escapeHtmlJs(videoUrl);
    const safeWsUrl = escapeHtmlJs(wsUrl);

    return `<style>
*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;box-sizing:border-box}
body{margin:0;background:#090a0f;font-family:Arial,Helvetica,sans-serif;color:#fff;touch-action:manipulation;cursor:pointer;direction:rtl}
input[type=range]{width:100%;height:4px;accent-color:#64b5f6;cursor:pointer}
.player-wrap{width:100%;max-width:440px;margin:auto;padding:12px}
.player{position:relative;overflow:hidden;background:#111318;border:1px solid rgba(100,180,255,0.12);border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.55)}
.bg{position:absolute;inset:-25px;background-position:center;background-size:cover;filter:blur(22px);opacity:.38;transform:scale(1.15);pointer-events:none}
.bg-overlay{position:absolute;inset:0;background:linear-gradient(180deg, rgba(5,6,10,.35), rgba(5,6,10,.72));pointer-events:none}
.content{position:relative;padding:18px;z-index:2}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}
.top-title{font-size:14px;font-weight:900;letter-spacing:1px;color:#64b5f6;opacity:.95}
.top-sub{font-size:10px;opacity:.5;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
.icon-btn{width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;cursor:pointer;transition:all .2s}
.icon-btn:hover{background:rgba(100,180,255,0.3);transform:scale(1.1)}
.icon-btn svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.video-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:15px;overflow:hidden;background:#000;box-shadow:0 12px 35px rgba(0,0,0,.45);cursor:pointer;direction:ltr;border:2px solid rgba(100,180,255,0.3)}
.video-frame video{width:100%;height:100%;display:block;background:#000;object-fit:contain}
.big-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.25);transition:opacity .2s;z-index:3}
.big-btn{width:70px;height:70px;border:0;border-radius:50%;background:linear-gradient(135deg,#1a73e8,#64b5f6);color:#08090d;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 8px 25px rgba(26,115,232,0.5);transition:all .2s}
.big-btn:hover{transform:scale(1.1)}
.big-btn svg{width:30px;height:30px;fill:currentColor;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.frame-playing .big-play{opacity:0;pointer-events:none}
.info{padding-top:15px}
.song-title{font-size:18px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
.artist{font-size:13px;color:#64b5f6;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.details-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.detail-box{background:rgba(100,180,255,0.1);border:1px solid rgba(100,180,255,0.25);border-radius:10px;padding:8px 10px}
.detail-label{font-size:9px;opacity:.6;letter-spacing:.5px}
.detail-value{font-size:13px;font-weight:700;color:#64b5f6;margin-top:2px}
.progress{margin-top:18px;direction:ltr}
.times{display:flex;justify-content:space-between;font-size:10px;opacity:.6;margin-top:7px;direction:ltr}
.controls{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:15px;direction:ltr}
.side-btn{width:44px;height:44px;border:2px solid rgba(100,180,255,0.3);background:rgba(255,255,255,.05);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:0;opacity:.9;cursor:pointer;transition:all .2s}
.side-btn:hover{background:rgba(100,180,255,0.2);transform:scale(1.1)}
.side-btn svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.bottom{display:flex;align-items:center;justify-content:space-between;margin-top:15px;gap:12px}
.bottom-left,.bottom-right{display:flex;align-items:center;gap:9px}
.volume{width:85px;direction:ltr}
.footer{text-align:center;margin-top:15px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1);font-size:11px;color:#64b5f6;font-weight:700}
.debug-wrap{margin-top:12px;background:#111318;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:12px;font-family:monospace;direction:ltr}
.debug-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.debug-title{font-size:11px;font-weight:700;letter-spacing:.8px;opacity:.85;color:#64b5f6}
.debug-state{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:rgba(255,255,255,.08);color:#ffd166;letter-spacing:.5px}
.debug-server{font-size:9px;opacity:.5;word-break:break-all;margin-bottom:8px;line-height:1.4}
.debug-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
.debug-cell{background:rgba(255,255,255,.05);border-radius:8px;padding:6px 8px;text-align:center}
.debug-cell span{display:block;font-size:8px;opacity:.5;letter-spacing:.5px}
.debug-cell b{display:block;font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.debug-bar{height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-bottom:8px}
.debug-bar-fill{height:100%;width:0;background:linear-gradient(90deg,#1a73e8,#64b5f6);transition:width .3s}
.debug-log{height:105px;overflow-y:auto;background:rgba(0,0,0,.35);border-radius:8px;padding:6px 8px;font-size:9px;line-height:1.6;color:rgba(255,255,255,.75);word-break:break-all;-webkit-overflow-scrolling:touch}
.log-line{white-space:pre-wrap}
</style>

<body>
<div class="player-wrap">
<div class="player">

<div class="bg" id="background"></div>
<div class="bg-overlay"></div>

<div class="content">

<div class="top">
<div>
<div class="top-title" id="playlistTitle">𝐅𝐀𝐍𝐈𝐓𝐀𝐒 PLAYER</div>
<div class="top-sub" id="playlistSub">${safeTitle}</div>
</div>

<button class="icon-btn" type="button" onclick="toggleMute()" id="muteButton" title="كتم / إلغاء الكتم">
<svg id="volumeIcon" viewBox="0 0 24 24">
<path d="M11 5 6 9H2v6h4l5 4V5z"></path>
<path d="M19 9a5 5 0 0 1 0 6"></path>
<path d="M16 6.5a9 9 0 0 1 0 11"></path>
</svg>
</button>
</div>

<div class="video-frame" id="videoFrame" onclick="toggleVideo()">
<video id="videoPlayer" playsinline webkit-playsinline preload="none" poster="${posterBase64}"></video>
<div class="big-play" id="bigPlay">
<button class="big-btn" type="button" onclick="event.stopPropagation();toggleVideo()">
<svg id="playIcon" viewBox="0 0 24 24">
<path d="M8 5v14l11-7z"></path>
</svg>
<svg id="pauseIcon" viewBox="0 0 24 24" style="display:none">
<path d="M7 5v14"></path>
<path d="M17 5v14"></path>
</svg>
</button>
</div>
</div>

<div class="info">
<div class="song-title" id="songTitle">فيديو غير معروف</div>
<div class="artist" id="artist">قناة غير معروفة</div>

<div class="details-grid">
<div class="detail-box">
<div class="detail-label">⏱️ المدة</div>
<div class="detail-value" id="durationDetail">${safeDuration}</div>
</div>
<div class="detail-box">
<div class="detail-label">📊 الحالة</div>
<div class="detail-value" id="statusDetail">جاري التحميل</div>
</div>
</div>
</div>

<div class="progress">
<input id="progress" type="range" min="0" max="100" value="0" step="0.1" oninput="seekVideo(this.value)">
<div class="times">
<span id="currentTime">0:00</span>
<span id="duration">0:00</span>
</div>
</div>

<div class="controls">
<button class="side-btn" type="button" onclick="previousVideo()" title="تقديم 10 ثواني">
<svg viewBox="0 0 24 24">
<path d="M19 20 9 12l10-8v16z"></path>
<path d="M5 19V5"></path>
</svg>
</button>
<button class="side-btn" type="button" onclick="toggleVideo()" title="تشغيل / إيقاف مؤقت" style="width:56px;height:56px">
<svg id="smallPlayIcon" viewBox="0 0 24 24" style="width:26px;height:26px">
<path d="M8 5v14l11-7z"></path>
</svg>
<svg id="smallPauseIcon" viewBox="0 0 24 24" style="display:none;width:26px;height:26px">
<path d="M7 5v14"></path>
<path d="M17 5v14"></path>
</svg>
</button>
<button class="side-btn" type="button" onclick="nextVideo()" title="ترجيع 10 ثواني">
<svg viewBox="0 0 24 24">
<path d="m5 4 10 8-10 8V4z"></path>
<path d="M19 5v14"></path>
</svg>
</button>
</div>

<div class="bottom">
<div class="bottom-left">
<button class="icon-btn" type="button" onclick="toggleRepeat()" id="repeatButton" title="إعادة التشغيل">
<svg viewBox="0 0 24 24">
<path d="M17 2l4 4-4 4"></path>
<path d="M3 11V9a3 3 0 0 1 3-3h15"></path>
<path d="m7 22-4-4 4-4"></path>
<path d="M21 13v2a3 3 0 0 1-3 3H3"></path>
</svg>
</button>
</div>
<div class="bottom-right">
<button class="icon-btn" type="button" onclick="toggleMute()">
<svg viewBox="0 0 24 24">
<path d="M11 5 6 9H2v6h4l5 4V5z"></path>
<path d="m19 9-5 6"></path>
<path d="m14 9 5 6"></path>
</svg>
</button>
<input class="volume" id="volume" type="range" min="0" max="1" step="0.01" value="1" oninput="changeVolume(this.value)">
</div>
</div>

<div class="footer">
🎬 𝐅𝐀𝐍𝐈𝐓𝐀𝐒 PLAYER
</div>

</div>
</div>

<div class="debug-wrap">
<div class="debug-head">
<div class="debug-title">WEBSOCKET STREAM</div>
<div class="debug-state" id="wsState">جاري الاتصال</div>
</div>
<div class="debug-server" id="wsServer">-</div>
<div class="debug-grid">
<div class="debug-cell"><span>الصيغة</span><b id="dbgMime">-</b></div>
<div class="debug-cell"><span>المُحمّل</span><b id="dbgDownloaded">0.00 MB</b></div>
<div class="debug-cell"><span>الإجمالي</span><b id="dbgTotal">-</b></div>
<div class="debug-cell"><span>التقدم</span><b id="dbgProgress">0%</b></div>
<div class="debug-cell"><span>القطع</span><b id="dbgChunks">0</b></div>
<div class="debug-cell"><span>التكرار</span><b id="dbgLoop">معطل</b></div>
</div>
<div class="debug-bar">
<div class="debug-bar-fill" id="dbgBarFill"></div>
</div>
<div class="debug-log" id="debugLog"></div>
</div>
</div>

<script>
window.VIDEO_CONFIG = {
    title: "${safeTitle}",
    channel: "${safeChannel}",
    duration: "${safeDuration}",
    videoUrl: "${safeVideoUrl}",
    wsUrl: "${safeWsUrl}",
    autoplay: false,
    volume: 0.8,
    loop: false
};

var video = document.getElementById("videoPlayer");
var frame = document.getElementById("videoFrame");
var songTitle = document.getElementById("songTitle");
var artist = document.getElementById("artist");
var progress = document.getElementById("progress");
var currentTime = document.getElementById("currentTime");
var durationLabel = document.getElementById("duration");
var volume = document.getElementById("volume");
var smallPlayIcon = document.getElementById("smallPlayIcon");
var smallPauseIcon = document.getElementById("smallPauseIcon");
var repeatButton = document.getElementById("repeatButton");
var playlistSub = document.getElementById("playlistSub");
var background = document.getElementById("background");
var statusDetail = document.getElementById("statusDetail");

var isLoop = false;
var userPressed = false;
var config = window.VIDEO_CONFIG || {};

songTitle.textContent = config.title || "فيديو غير معروف";
artist.textContent = config.channel || "قناة غير معروفة";
playlistSub.textContent = config.title || "فيديو غير معروف";

if (video.poster && background) {
    background.style.backgroundImage = "url('" + video.poster + "')";
}

if (config.volume !== undefined) {
    video.volume = config.volume;
    volume.value = config.volume;
}

isLoop = config.loop || false;
video.loop = isLoop;
updateLoopStatus();

function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds % 60);
    if (sec < 10) sec = "0" + sec;
    return min + ":" + sec;
}

function updateUI() {
    if (video.paused) {
        smallPlayIcon.style.display = "block";
        smallPauseIcon.style.display = "none";
        frame.classList.remove("frame-playing");
        if (statusDetail) statusDetail.textContent = "موقوف";
    } else {
        smallPlayIcon.style.display = "none";
        smallPauseIcon.style.display = "block";
        frame.classList.add("frame-playing");
        if (statusDetail) statusDetail.textContent = "يشغل الآن";
    }
}

function playVideo() {
    var result = video.play();
    if (result && result.catch) {
        result.catch(function() {});
    }
    updateUI();
}

function toggleVideo() {
    if (video.paused) {
        if (!video.src) userPressed = true;
        playVideo();
    } else {
        userPressed = false;
        video.pause();
    }
    updateUI();
}

function previousVideo() {
    if (!isFinite(video.duration)) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
}

function nextVideo() {
    if (!isFinite(video.duration)) return;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
}

function seekVideo(value) {
    if (!isFinite(video.duration)) return;
    video.currentTime = (Number(value) / 100) * video.duration;
}

function changeVolume(value) {
    video.volume = Number(value);
    if (video.volume > 0) video.muted = false;
}

function toggleMute() {
    video.muted = !video.muted;
}

function toggleRepeat() {
    isLoop = !isLoop;
    video.loop = isLoop;
    repeatButton.style.opacity = isLoop ? "1" : ".55";
    repeatButton.title = isLoop ? "التكرار مفع
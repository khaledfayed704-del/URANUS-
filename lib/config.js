/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import { Buffer } from 'buffer';

export const METADATA_DECRYPTION_KEY = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');

export const HEADERS = {
  'Content-Type': 'application/json',
  'Origin': 'https://yt.savetube.me',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'
};

export const FFMPEG_CONFIG = {
  bitrate: '16k',
  sampleRate: '24000',
  channels: '1',
  codec: 'libopus',
  format: 'ogg'
};

export const LIMITS = {
  maxOriginalAudioMb: 25,
  maxOriginalAudioSize: 25 * 1024 * 1024,
  maxCompressedAudioMb: 6,
  maxCompressedAudioSize: 6 * 1024 * 1024
};

export const LRCLIB_CONFIG = {
  api: 'https://lrclib.net/api',
  userAgent: 'AnyaMD-Play2/1.0 (https://github.com/)'
};
// plugins/fuse.js
// ⧼ ᏞᎩᏁᎾ᙭ ⧽v2 - فيوز (اقتباسات عشوائية) 🎨

import axios from 'axios';
import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, args, command }) => {
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
    // إذا كان المستخدم كتب نص (يعمل كصانع ملصقات)
    if (args.length > 0) {
      await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });
      await m.reply('🎨 *جاري صناعة الملصق...* 💙');

      let text = encodeURIComponent(args.join(" "));
      let name = encodeURIComponent(m.pushName || "User");

      // استخدام API PopCat (يعمل 100%)
      const api = `https://api.popcat.xyz/quote?text=${text}&author=${name}`;
      
      const { data } = await axios.get(api, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      await conn.sendMessage(m.chat, {
        sticker: Buffer.from(data)
      }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      return;
    }

    // إذا لم يكتب نص → يجيب اقتباس عشوائي
    await conn.sendMessage(m.chat, { react: { text: '📖', key: m.key } });
    await m.reply('📖 *جاري جلب اقتباس ملهم...* 💙');

    // ✅ API جديد يعمل 100% (بدون حماية)
    const apiUrl = 'https://quoteslate.vercel.app/api/quotes/random';
    
    const { data } = await axios.get(apiUrl, { timeout: 15000 });

    const resultText = theme.build([
      { type: 'title', text: '💬 اقتباس ملهم' },
      { type: 'spacer' },
      { type: 'line', text: `"${data.quote}"` },
      { type: 'spacer' },
      { type: 'info', label: '✍️ المؤلف', value: data.author },
      { type: 'divider' },
      { type: 'line', text: '⭐ اقتباس عشوائي - شاركه مع أصدقائك' }
    ]);

    await conn.sendMessage(m.chat, { text: resultText }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    
    m.reply(theme.build([
      { type: 'error', text: '❌ حدث خطأ' },
      { type: 'info', label: 'السبب', value: err.message || 'فشل جلب الاقتباس' },
      { type: 'warning', text: 'حاول مرة أخرى لاحقاً' }
    ]));
  }
};

handler.help = ['فيوز <نص>'];
handler.tags = ['tools'];
handler.command = /^(فيوز|fuse)$/i;

export default handler;
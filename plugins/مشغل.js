// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// ============================================================
// FILE: interactive-player.js - المشغل التفاعلي (بدون نص)
// ============================================================

const handler = async (m, { conn, command, text }) => {
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

  let videoUrl = "https://files.catbox.moe/ufz4yc.mp4"; // الفيديو الرئيسي

  // إذا كتب المستخدم أمراً معيناً بعد الزر، نغير الفيديو
  if (command === 'v1') {
    videoUrl = "https://files.catbox.moe/ufz4yc.mp4"; // الفيديو الأول
  } else if (command === 'v2') {
    videoUrl = "https://files.catbox.moe/lu0q0q.mp4"; // الفيديو الثاني
  } else if (command === 'v3') {
    videoUrl = "https://files.catbox.moe/qnp3uz.mp4"; // الفيديو الثالث
  }

  // إرسال الفيديو مع أزرار حقيقية
  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: '', // لا يوجد نص عادي (فقط فيديو)
    buttons: [
      { buttonId: 'v1', buttonText: { displayText: '🎬 المشهد 1' }, type: 1 },
      { buttonId: 'v2', buttonText: { displayText: '🎬 المشهد 2' }, type: 1 },
      { buttonId: 'v3', buttonText: { displayText: '🎬 المشهد 3' }, type: 1 }
    ],
    viewOnce: true
  }, { quoted: m });

  // عند الضغط على زر، يتم إرسال فيديو آخر (ردود)
  if (text) {
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: ''
    }, { quoted: m });
  }
};

handler.help = ['مشغل'];
handler.tags = ['game', 'fun'];
handler.command = ['مشغل', 'v1', 'v2', 'v3'];

export default handler;
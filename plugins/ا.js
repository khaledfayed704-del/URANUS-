// plugins/nixcode-demo.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - عرض جميع أنواع الأزرار 🔘

import { Button, ButtonV2, Carousel } from '../System/NIXCODE.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn }) => {
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


  // ═══════════════════════════════════════
  // 1️⃣ زر عادي + قائمة منسدلة + URL + Copy
  // ═══════════════════════════════════════
  await new Button(conn)
    .setTitle(' 🪐 ᏌᏒ - LynoX bot')
    .setSubtitle('الأزرار التفاعلية')
    .setBody('اختر من القائمة أدناه')
    .setFooter(' 🪐 ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B  🪐')
    .setImage('https://file.garden/aauvg01sjleV_ic1/ᏌᏒ.jpg')
    .addReply('📂 الأقسام', '.اوامر')
    .addReply('👤 المطور', '.المطور')
    .addUrl('📢 القناة', 'https://whatsapp.com/channel/0029Vb8We2VKrWR2Z9E5KQ1P', true)
    .addCopy('📋 نسخ الرقم', 'رقم المطور 1')
    .addSelection('📚 اختر القسم')
    .makeSection('الأقسام الرئيسية')
    .makeRow('👮‍♂️', 'قسم الأدمن', 'أوامر المشرفين', '.ق1')
    .makeRow('🎨', 'قسم الاستيكر', 'الملصقات', '.ق2')
    .makeRow('🎮', 'قسم الألعاب', 'ألعاب تفاعلية', '.ق3')
    .send(m.chat, { quoted: m })

  // ═══════════════════════════════════════
  // 2️⃣ أزرار عائمة (Floating)
  // ═══════════════════════════════════════
  await new ButtonV2(conn)
    .setTitle(' 🪐 ᏌᏒ - LynoX bot')
    .setSubtitle('أزرار عائمة')
    .setBody('هذه أزرار منفصلة عن النص')
    .setFooter(' 🪐 ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B  🪐')
    .setThumbnail('https://file.garden/aauvg01sjleV_ic1/ᏌᏒ.jpg')
    .addRawButton({
      buttonText: { displayText: '📂 الأقسام' },
      buttonId: 'menu',
      type: 1,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: "اختر القسم",
          sections: [{
            title: "الأقسام",
            rows: [
              { title: "👮‍♂️ قسم الأدمن", description: "أوامر المشرفين", id: ".ق1" },
              { title: "🎨 قسم الاستيكر", description: "الملصقات", id: ".ق2" },
              { title: "🎮 قسم الألعاب", description: "ألعاب تفاعلية", id: ".ق3" }
            ]
          }]
        })
      }
    })
    .addButton('👤 المطور', '.المطور')
    .addButton('⭐ تقييم', '.تقييم')
    .send(m.chat)

  // ═══════════════════════════════════════
  // 3️⃣ كاروسيل (سلايدر)
  // ═══════════════════════════════════════
  await new Carousel(conn)
    .setBody('🎮 أقسام ᏌᏒ')
    .setFooter(' 🪐 اسحب للتصفح  🪐')
    .addCard(
      await new Button(conn)
        .setTitle('👮‍♂️ قسم الأدمن')
        .setBody('أوامر المشرفين')
        .setImage('https://file.garden/aauvg01sjleV_ic1/download%20(5).jpg')
        .addReply('📂 فتح', '.ق1')
        .toCard()
    )
    .addCard(
      await new Button(conn)
        .setTitle('🎮 قسم الألعاب')
        .setBody('ألعاب تفاعلية')
        .setImage('https://file.garden/aauvg01sjleV_ic1/Fabio%20Ferrero%20(@funzionefabio)%20%E2%80%A2%20Instagram%20photos%20and%20videos.jpg')
        .addReply('🎮 فتح', '.ق3')
        .toCard()
    )
    .addCard(
      await new Button(conn)
        .setTitle('🎉 قسم التسلية')
        .setBody('ترفيه وألعاب')
        .setImage('https://file.garden/aauvg01sjleV_ic1/ᏌᏒ.webp')
        .addReply('🎉 فتح', '.ق10')
        .toCard()
    )
    .send(m.chat, { quoted: m })

}

handler.help = ['نيوكس']
handler.tags = ['tools']
handler.command = /^(نيوكس|nixcode|demo)$/i

export default handler
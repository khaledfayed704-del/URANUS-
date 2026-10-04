// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - أمر الحذف ✧
// مهمة: حذف أي رسالة يتم الرد عليها

import { theme } from '../System/theme.js'
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


let handler = async (m, { conn, isAdmin, isROwner }) => {
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

  if (!m.quoted) return m.reply(` 🪐 *ᏌᏒ:* "لم أحدد هدفاً للحذف. قم بالرد على الرسالة التي تريد مسحها."`)

  if (m.isGroup && !isAdmin && !isROwner) {
    return m.reply(theme.error(`هذه المهمة تتطلب صلاحيات مشرف.`))
  }

  try {
    const q = m.quoted

    // ── بناء مفتاح الحذف ─────────────────────────────────────────────────
    const deleteKey = {
      remoteJid: m.chat,
      fromMe:    q.fromMe ?? q.isSelf ?? (q.sender === conn.user.jid),
      id:        q.id ?? q.key?.id,
      ...(m.isGroup && { participant: q.sender ?? q.participant ?? q.key?.participant })
    }

    if (!deleteKey.id) {
      console.log('[ᏌᏒ-DEL] مفتاح الهدف غير صالح')
      return
    }

    await conn.sendMessage(m.chat, { delete: deleteKey })
    // ᏌᏒ لا ترد على أوامر الحذف - التنفيذ الصامت هو أسلوبها

  } catch (e) {
    console.error('[ᏌᏒ-DEL] فشل الحذف:', e.message)
    m.reply(` 🪐 *ᏌᏒ:* "فشلت عملية المسح... الهدف غير موجود أو محمي."`)
  }
}

handler.command = /^(حذف|مسح|delete|del|امسح|امحو)$/i
export default handler
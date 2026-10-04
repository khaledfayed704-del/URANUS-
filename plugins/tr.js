import fs from 'fs';
import path from 'path';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const handler = async (m, { conn, text }) => {
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

  if (!text) {
    await conn.sendMessage(m.chat, { text: '⚠️ يرجى إدخال الكلمة المطلوبة للبحث عنها.' }, { quoted: m });
    return;
  }

  await conn.sendMessage(m.chat, { text: '🔍 جاري البحث عن الكلمة في ملفات المسار plugins...' }, { quoted: m });

  const basePath = 'plugins'; // تحديد مسار المجلد
  const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js')); // جميع الملفات داخل المجلد
  const matchedResults = [];
  let fileReadErrors = []; // لتسجيل الأخطاء أثناء قراءة الملفات

  // أنماط النصوص المسموح بها مع تطابق دقيق
  const validPatterns = [
    /^handler\.command\s*=\s*\/\^(tr)\$\/i/, // تطابق دقيق مع handler.command = /^(tr)$/i
    /^const\s+audioCommands\s*=\s*\[.*\]/, // السطر يبدأ بـ const
    /handler\.help\s*=\s*\[.*\]/, // handler.help = ['', '']
    /handler\.command\s*=\s*\/\^.*\$/i, // handler.command = /^()$/i
    /=\s*\[.*\]/, // = ['', '', '', '']
  ];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(basePath, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const fileLines = fileContent.split('\n'); // تقسيم المحتوى إلى أسطر

      fileLines.forEach((line, index) => {
        if (line.includes(text)) {
          // تحقق إذا كان السطر يطابق أحد الأنماط المحددة
          if (validPatterns.some(pattern => pattern.test(line))) {
            matchedResults.push({
              fileIndex: i + 1, // رقم الكود (ترتيب الملف)
              fileName,
              lineNumber: index + 1,
              lineContent: line.trim(),
            });
          }
        }
      });
    } catch (error) {
      fileReadErrors.push({ fileName, error: error.message });
    }
  }

  // عرض النتائج إذا تم العثور على شيء
  if (matchedResults.length > 0) {
    let responseMessage = `✅ تم العثور على "${text}" في الملفات التالية:\n\n`;
    matchedResults.forEach(({ fileIndex, fileName, lineNumber, lineContent }) => {
      responseMessage += `📄 رقم الكود: ${fileIndex}\n📄 الملف: ${fileName}\n🔢 السطر: ${lineNumber}\n➡️ السطر: ${lineContent}\n\n`;
    });
    await conn.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
  } else {
    // إذا لم يتم العثور على النص
    let errorMessage = `❌ لم يتم العثور على "${text}" في أي ملف ضمن المسار plugins.\n`;

    // إضافة رسائل الأخطاء إذا كانت موجودة
    if (fileReadErrors.length > 0) {
      errorMessage += '\n⚠️ أخطاء أثناء قراءة بعض الملفات:\n';
      fileReadErrors.forEach(({ fileName, error }) => {
        errorMessage += `- الملف: ${fileName}\n  السبب: ${error}\n`;
      });
    }

    await conn.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
  }
};

handler.help = ['كشف'].map(v => v + ' *<الكلمة>*');
handler.tags = ['owner'];
handler.command = /^(كش)$/i;
handler.rowner = true;

export default handler;
// plugins/رواية.js
import axios from 'axios';
import cheerio from 'cheerio';
import { ButtonV2 } from '../System/NIXCODE.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


const pendingSearches = new Map();

function similarity(str1, str2) {
  const words1 = str1.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const words2 = str2.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (words1.length === 0) return 0;
  let common = 0;
  for (const w of words1) {
    if (words2.includes(w)) common++;
  }
  return common / words1.length;
}

// ===== بحث Archive.org =====
async function searchArchive(query) {
  try {
    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:texts&fl[]=identifier&fl[]=title&fl[]=creator&sort[]=downloads+desc&rows=10&output=json`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000
    });
    const docs = data?.response?.docs || [];
    return docs.map(doc => ({
      title: doc.title || 'بدون عنوان',
      author: doc.creator || '',
      identifier: doc.identifier,
      link: `https://archive.org/details/${doc.identifier}`,
      cover: `https://archive.org/services/img/${doc.identifier}`,
      source: 'archive'
    }));
  } catch (e) {
    console.error('Archive search error:', e.message);
    return [];
  }
}

// ===== بحث Goodreads =====
async function searchGoodreads(query) {
  try {
    const res = await axios.get('https://www.goodreads.com/search', {
      params: { q: query, search_type: 'books' },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 20000
    });
    const $ = cheerio.load(res.data);
    const books = [];

    $('table.tableList tr').each((i, el) => {
      const titleEl = $(el).find('a.bookTitle');
      const authorEl = $(el).find('a.authorName');
      const imgEl = $(el).find('img.bookCover');
      const title = titleEl.text().trim();
      const author = authorEl.text().trim();
      const link = titleEl.attr('href');
      const cover = imgEl.attr('src') || '';
      const rating = $(el).find('span.minirating').text().trim();
      if (title && link) {
        books.push({
          title,
          author: author || '',
          link: link.startsWith('http') ? link : `https://www.goodreads.com${link}`,
          cover,
          rating: rating || '',
          source: 'goodreads'
        });
      }
    });

    if (books.length === 0) {
      $('a[href*="/book/show/"]').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        if (title && href && title.length > 1 && !title.includes('Book cover')) {
          books.push({
            title,
            author: '',
            link: href.startsWith('http') ? href : `https://www.goodreads.com${href}`,
            cover: '',
            rating: '',
            source: 'goodreads'
          });
        }
      });
    }
    return books.slice(0, 8);
  } catch (e) {
    console.error('Goodreads search error:', e.message);
    return [];
  }
}

// ===== جلب تفاصيل Goodreads =====
async function getGoodreadsDetails(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 15000
    });
    const $ = cheerio.load(res.data);
    const title = $('h1.bookTitle').text().trim() || $('h1.Text__title1').text().trim();
    const author = $('a.authorName').first().text().trim() || $('span.ContributorLink__name').first().text().trim();
    const description = $('div.DetailsLayoutRightParagraph__widthConstrained').first().text().trim() ||
                        $('div.readable.stacked').first().text().trim();
    const cover = $('img.BookCover__image').first().attr('src') || $('img.bookCover').attr('src');
    return {
      title: title || '',
      author: author || '',
      description: description ? description.slice(0, 300) : '',
      cover: cover || ''
    };
  } catch (e) {
    return { title: '', author: '', description: '', cover: '' };
  }
}

// ===== إرسال PDF من Archive =====
async function sendArchivePDF(conn, chat, item, m) {
  try {
    const metadataUrl = `https://archive.org/metadata/${item.identifier}`;
    const { data: meta } = await axios.get(metadataUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    const files = meta.files || [];
    const pdfFile = files.find(f => f.name?.toLowerCase().endsWith('.pdf'));
    if (!pdfFile) return false;

    const pdfUrl = `https://archive.org/download/${item.identifier}/${encodeURIComponent(pdfFile.name)}`;
    const pdfRes = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 60000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const buffer = Buffer.from(pdfRes.data);
    if (buffer.length < 5000) return false;

    await conn.sendMessage(chat, {
      document: buffer,
      fileName: `${item.title}.pdf`,
      mimetype: 'application/pdf',
      caption: `📖 ${item.title}`
    }, { quoted: m });
    return true;
  } catch (e) {
    console.error('PDF send error:', e.message);
    return false;
  }
}

// ===== معالجة الاختيار =====
async function handleChoice(conn, m, chat, item) {
  try {
    await conn.sendMessage(chat, { react: { text: '📥', key: m.key } });

    // إذا كان من Archive مباشرة
    if (item.source === 'archive') {
      const sent = await sendArchivePDF(conn, chat, item, m);
      if (sent) {
        await conn.sendMessage(chat, { react: { text: '✅', key: m.key } });
      } else {
        await conn.sendMessage(chat, { text: '❌ لا يوجد PDF متاح لهذا الكتاب.' }, { quoted: m });
      }
      return;
    }

    // إذا كان من Goodreads: نبحث في Archive بنفس العنوان
    if (item.source === 'goodreads') {
      const details = await getGoodreadsDetails(item.link);
      const searchQuery = details.title || item.title;
      const archiveResults = await searchArchive(searchQuery);

      // نختار أفضل تطابق
      const scored = archiveResults.map(r => ({
        ...r,
        score: similarity(searchQuery, r.title)
      }));
      scored.sort((a, b) => b.score - a.score);

      let sent = false;
      for (const archiveItem of scored) {
        if (archiveItem.score > 0.3) {
          sent = await sendArchivePDF(conn, chat, archiveItem, m);
          if (sent) break;
        }
      }

      if (sent) {
        await conn.sendMessage(chat, { react: { text: '✅', key: m.key } });
        return;
      }

      // إذا لم نجد PDF، نرسل تفاصيل Goodreads
      let reply = `📚 *${details.title || item.title}*\n` +
                  `✍️ *المؤلف:* ${details.author || item.author}\n`;
      if (details.description) reply += `📝 *الوصف:* ${details.description}\n`;

      if (details.cover) {
        try {
          const imgRes = await axios.get(details.cover, { responseType: 'arraybuffer', timeout: 10000 });
          const buffer = Buffer.from(imgRes.data);
          await conn.sendMessage(chat, { image: buffer, caption: reply }, { quoted: m });
        } catch {
          await conn.sendMessage(chat, { text: reply }, { quoted: m });
        }
      } else {
        await conn.sendMessage(chat, { text: reply }, { quoted: m });
      }
      await conn.sendMessage(chat, { react: { text: '✅', key: m.key } });
    }
  } catch (e) {
    console.error('Choice error:', e.message);
    await conn.sendMessage(chat, { text: `❌ خطأ: ${e.message}` }, { quoted: m });
  }
}

// ===== الهاندلر الرئيسي =====
let handler = async (m, { conn, text, usedPrefix, command }) => {
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

  const chat = m.chat || m.key.remoteJid;
  const sender = m.sender || m.key.participant || chat;

  if (!text) {
    return conn.sendMessage(chat, {
      text: `📚 *ابحث عن رواية*\n\n` +
            `📝 *الاستخدام:*\n${usedPrefix}${command} <اسم الرواية>\n\n` +
            `⚡ *مثال:*\n${usedPrefix}${command} ألف ليلة وليلة`
    }, { quoted: m });
  }

  await conn.sendMessage(chat, { react: { text: '🔍', key: m.key } });

  try {
    const [archiveResults, goodreadsResults] = await Promise.all([
      searchArchive(text),
      searchGoodreads(text)
    ]);

    const allResults = [
      ...archiveResults.map(r => ({ ...r, score: similarity(text, r.title) })),
      ...goodreadsResults.map(r => ({ ...r, score: similarity(text, r.title) }))
    ];

    const seenLinks = new Set();
    const unique = [];
    for (const r of allResults) {
      if (!seenLinks.has(r.link)) {
        seenLinks.add(r.link);
        unique.push(r);
      }
    }
    unique.sort((a, b) => b.score - a.score);

    if (unique.length === 0) {
      await conn.sendMessage(chat, { react: { text: '❌', key: m.key } });
      return conn.sendMessage(chat, { text: '❌ لم يتم العثور على نتائج.' }, { quoted: m });
    }

    const top = unique.slice(0, 10);

    // مفتاح فريد لكل نتيجة عشان نربطه بالـ id بتاع الصف من غير ما نكرر بيانات كبيرة في الـ id
    const searchId = `${sender.split('@')[0]}_${Date.now()}`;
    pendingSearches.set(searchId, {
      sender,
      results: top,
      timestamp: Date.now()
    });

    // تنضيف بحث قديم لنفس الشخص عشان الماب مايكبرش من غير داعي
    for (const [key, val] of pendingSearches) {
      if (val.sender === sender && key !== searchId) pendingSearches.delete(key);
      if (Date.now() - val.timestamp > 600000) pendingSearches.delete(key);
    }

    const rows = top.map((b, i) => {
      const icon = b.source === 'archive' ? '📦 أرشيف' : '📖 Goodreads';
      const title = b.title.length > 60 ? b.title.slice(0, 57) + '...' : b.title;
      const desc = b.author ? `✍️ ${b.author} • ${icon}` : icon;
      return {
        title,
        description: desc,
        id: `.رواية_اختر ${searchId} ${i}`
      };
    });

    const nativeFlowInfo = {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: '📚 عرض النتائج',
        sections: [
          {
            title: `【 نتائج "${text}" 】`,
            rows
          }
        ]
      })
    };

    // نجيب صورة غلاف أفضل نتيجة عشان تظهر كصورة مصغّرة للرسالة (بنفس أسلوب زرار الأرشيف)
    const topCoverUrl = top[0]?.cover || 'https://files.catbox.moe/3vlgrf.jpg';

    await new ButtonV2(conn)
      .setBody(`📚 *نتائج البحث عن:* "${text}"\n\nاضغط على الزر أدناه واختار الرواية اللي عايزها 👇`)
      .setFooter(global.watermark || '🪐 ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿ')
      .setThumbnail(topCoverUrl)
      .addRawButton({
        buttonText: { displayText: '📚 ◂◄ عرض النتائج ►▸' },
        buttonId: 'رواية_قائمة',
        type: 1,
        nativeFlowInfo
      })
      .send(chat, { quoted: m });

    await conn.sendMessage(chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error('Main error:', e.message);
    await conn.sendMessage(chat, { text: `❌ خطأ: ${e.message}` }, { quoted: m });
  }
};

// ===== معالجة اختيار الصف من القائمة =====
handler.before = async (m, { conn }) => {
  const chat = m.chat || m.key.remoteJid;
  const text = (m.text || '').trim();

  if (!text.startsWith('.رواية_اختر ')) return;

  const parts = text.split(/\s+/);
  const searchId = parts[1];
  const idx = parseInt(parts[2], 10);

  const data = pendingSearches.get(searchId);
  if (!data) {
    await conn.sendMessage(chat, { text: '⌛ انتهت صلاحية هذه القائمة، ابحث من جديد.' }, { quoted: m });
    return true;
  }

  if (Date.now() - data.timestamp > 600000) {
    pendingSearches.delete(searchId);
    await conn.sendMessage(chat, { text: '⌛ انتهت صلاحية هذه القائمة، ابحث من جديد.' }, { quoted: m });
    return true;
  }

  if (isNaN(idx) || idx < 0 || idx >= data.results.length) return true;

  const item = data.results[idx];
  pendingSearches.delete(searchId);
  await handleChoice(conn, m, chat, item);
  return true;
};

handler.command = ['رواية', 'روايه', 'نوف', 'novel', 'book'];
handler.help = ['رواية <اسم>'];
handler.tags = ['books'];

export default handler;
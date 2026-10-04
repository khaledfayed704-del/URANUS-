// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};

// game-minecraft.js
// 🗡️⛏️ لعبة ماينكرافت نصية لبوت الواتساب
// متوافقة مع نظام البلوجنز في handler.js (global.db.data.users)

const PICKAXE_LEVELS = {
    'لا_شيء': 0,
    'معول_خشب': 1,
    'معول_حجر': 2,
    'معول_حديد': 3,
    'معول_ماس': 4
}

const CRAFT_RECIPES = {
    'معول_خشب': { level: 1, needs: { wood: 3 } },
    'معول_حجر': { level: 2, needs: { wood: 1, stone: 3 } },
    'معول_حديد': { level: 3, needs: { wood: 1, iron: 3 } },
    'معول_ماس': { level: 4, needs: { wood: 1, diamond: 3 } }
}

const SELL_PRICES = { wood: 1, stone: 2, iron: 5, diamond: 15 }

const CHOP_COOLDOWN = 20 * 1000      // 20 ثانية
const MINE_COOLDOWN = 45 * 1000      // 45 ثانية

function getPlayer(m) {
    let user = global.db.data.users[m.sender]
    if (!user.minecraft) {
        user.minecraft = {
            wood: 0,
            stone: 0,
            iron: 0,
            diamond: 0,
            coins: 0,
            pickaxe: 'لا_شيء',
            lastChop: 0,
            lastMine: 0
        }
    }
    // تأكد إن كل الحقول موجودة (لو تحدثت اللعبة لاحقًا)
    const defaults = { wood: 0, stone: 0, iron: 0, diamond: 0, coins: 0, pickaxe: 'لا_شيء', lastChop: 0, lastMine: 0 }
    for (let k in defaults) {
        if (!(k in user.minecraft)) user.minecraft[k] = defaults[k]
    }
    return user.minecraft
}

function fmtTime(ms) {
    let s = Math.ceil(ms / 1000)
    if (s < 60) return `${s} ثانية`
    return `${Math.floor(s / 60)} دقيقة و ${s % 60} ثانية`
}

function inventoryText(p) {
    return `🗡️⛏️ *جرد ماينكرافت*

🪵 خشب: ${p.wood}
🪨 حجر: ${p.stone}
⛏️ حديد: ${p.iron}
💎 ماس: ${p.diamond}
🪙 نقود: ${p.coins}

🛠️ المعول الحالي: ${p.pickaxe.replace(/_/g, ' ')}`
}

function menuText(usedPrefix) {
    return `🗡️⛏️ *لعبة ماينكرافت*

${usedPrefix}ماين قطع — احطب خشب
${usedPrefix}ماين تعدين — عدّن موارد (حسب معولك)
${usedPrefix}ماين صنع <اسم الأداة> — اصنع معول
${usedPrefix}ماين جرد — شوف جردك
${usedPrefix}ماين بيع <مورد> <عدد> — بيع مورد مقابل نقود
${usedPrefix}ماين رصيد — شوف رصيدك من النقود

📦 أدوات ممكن تصنعها:
معول_خشب (يحتاج 3 خشب)
معول_حجر (يحتاج 1 خشب + 3 حجر)
معول_حديد (يحتاج 1 خشب + 3 حديد)
معول_ماس (يحتاج 1 خشب + 3 ماس)

💰 أسعار البيع:
خشب: ${SELL_PRICES.wood} | حجر: ${SELL_PRICES.stone} | حديد: ${SELL_PRICES.iron} | ماس: ${SELL_PRICES.diamond}`
}

const RESOURCE_MAP = {
    'خشب': 'wood', 'wood': 'wood',
    'حجر': 'stone', 'stone': 'stone',
    'حديد': 'iron', 'iron': 'iron',
    'ماس': 'diamond', 'diamond': 'diamond'
}

let handler = async (m, { conn, args, usedPrefix }) => {
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

    const p = getPlayer(m)
    const sub = (args[0] || '').trim()

    // القائمة الرئيسية
    if (!sub || sub === 'قائمة' || sub === 'menu') {
        return m.reply(menuText(usedPrefix))
    }

    // 🪓 قطع الخشب
    if (sub === 'قطع' || sub === 'chop') {
        const now = Date.now()
        const remaining = p.lastChop + CHOP_COOLDOWN - now
        if (remaining > 0) {
            return m.reply(`⏳ لازم تستنى ${fmtTime(remaining)} قبل ما تقطع خشب تاني.`)
        }
        const gained = 1 + Math.floor(Math.random() * 3) // 1-3
        p.wood += gained
        p.lastChop = now
        return m.reply(`🪓 قطعت خشب وحصلت على *${gained} 🪵 خشب*!\nإجمالي الخشب: ${p.wood}`)
    }

    // ⛏️ التعدين
    if (sub === 'تعدين' || sub === 'mine') {
        const now = Date.now()
        const remaining = p.lastMine + MINE_COOLDOWN - now
        if (remaining > 0) {
            return m.reply(`⏳ لازم تستنى ${fmtTime(remaining)} قبل ما تعدّن تاني.`)
        }

        const level = PICKAXE_LEVELS[p.pickaxe] ?? 0
        if (level < 1) {
            return m.reply(`❌ محتاج تصنع *معول_خشب* الأول عشان تقدر تعدّن.\nاستخدم: ${usedPrefix}ماين صنع معول_خشب`)
        }

        // تحديد أعلى مورد ممكن يطلعه حسب مستوى المعول
        let pool = ['stone']
        if (level >= 2) pool.push('iron')
        if (level >= 3) pool.push('diamond')

        const resource = pool[Math.floor(Math.random() * pool.length)]
        const gained = 1 + Math.floor(Math.random() * (resource === 'diamond' ? 1 : 3))
        p[resource] += gained
        p.lastMine = now

        const names = { stone: '🪨 حجر', iron: '⛏️ حديد', diamond: '💎 ماس' }
        return m.reply(`⛏️ عدّنت وحصلت على *${gained} ${names[resource]}*!\nإجمالي ${names[resource]}: ${p[resource]}`)
    }

    // 🛠️ الصناعة
    if (sub === 'صنع' || sub === 'craft') {
        const itemRaw = (args[1] || '').trim()
        const item = itemRaw.replace(/\s+/g, '_')
        const recipe = CRAFT_RECIPES[item]

        if (!recipe) {
            return m.reply(`❌ الأداة دي مش معروفة. الأدوات المتاحة:\n${Object.keys(CRAFT_RECIPES).join('\n')}`)
        }

        const currentLevel = PICKAXE_LEVELS[p.pickaxe] ?? 0
        if (recipe.level <= currentLevel) {
            return m.reply(`✋ عندك بالفعل معول بنفس المستوى أو أعلى (${p.pickaxe.replace(/_/g,' ')}).`)
        }

        // تحقق من المواد
        for (let mat in recipe.needs) {
            if (p[mat] < recipe.needs[mat]) {
                const namesAr = { wood: 'خشب', stone: 'حجر', iron: 'حديد', diamond: 'ماس' }
                return m.reply(`❌ مش عندك مواد كفاية. محتاج ${recipe.needs[mat]} ${namesAr[mat]} وعندك ${p[mat]} بس.`)
            }
        }

        // خصم المواد وإضافة الأداة
        for (let mat in recipe.needs) p[mat] -= recipe.needs[mat]
        p.pickaxe = item

        return m.reply(`🛠️ صنعت *${item.replace(/_/g, ' ')}* بنجاح! 🎉`)
    }

    // 🎒 الجرد
    if (sub === 'جرد' || sub === 'inventory' || sub === 'inv') {
        return m.reply(inventoryText(p))
    }

    // 💰 الرصيد
    if (sub === 'رصيد' || sub === 'balance' || sub === 'bal') {
        return m.reply(`🪙 رصيدك من النقود: ${p.coins}`)
    }

    // 💸 البيع
    if (sub === 'بيع' || sub === 'sell') {
        const resArg = (args[1] || '').trim()
        const resource = RESOURCE_MAP[resArg]
        const amount = parseInt(args[2])

        if (!resource) {
            return m.reply(`❌ حدد مورد صحيح للبيع: خشب / حجر / حديد / ماس\nمثال: ${usedPrefix}ماين بيع حديد 5`)
        }
        if (!amount || amount <= 0) {
            return m.reply(`❌ حدد عدد صحيح تبي تبيعه.\nمثال: ${usedPrefix}ماين بيع حديد 5`)
        }
        if (p[resource] < amount) {
            return m.reply(`❌ مش عندك كفاية. عندك ${p[resource]} بس.`)
        }

        const total = amount * SELL_PRICES[resource]
        p[resource] -= amount
        p.coins += total

        return m.reply(`💸 بعت ${amount} من هذا المورد مقابل *${total} 🪙*!\nرصيدك الحالي: ${p.coins} 🪙`)
    }

    // أمر غير معروف
    return m.reply(`❓ أمر غير معروف. اكتب *${usedPrefix}ماين* بمفردها لعرض القائمة.`)
}

handler.help = ['ماين', 'ماين قطع', 'ماين تعدين', 'ماين صنع', 'ماين جرد', 'ماين بيع', 'ماين رصيد']
handler.tags = ['game']
handler.command = ['ماين', 'ماينكرافت', 'minecraft', 'mc']

export default handler
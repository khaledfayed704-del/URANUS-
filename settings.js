// config.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - Configuration ✧

import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

//حط lid بتاعك من امر lid
global.owner = ['ليد المالك 1@lid', 'ليد المالك 2@lid', 'ليد المالك 3@lid', 'ليد المالك 4@lid']

// ========== المطورين ==========
global.mods = []
global.prems = []

// ========== إعدادات البوت ==========
global.baileys = '@whiskeysockets/baileys'
global.botName = '✧ 🪐 ᏞᎩᏁᎾ᙭ ✧'
global.botNameShort = 'ᏞᎩᏁᎾ᙭'
global.watermark = '✧ © ᏞᎩᏁᎾ᙭ - كل الحقوق محفوظة ✧'

// ========== المكتبات العامة ==========
global.fetch = fetch
global.axios = axios
global.moment = moment
global.fs = fs

// ========== إعدادات البوت ==========
global.packname = '✧ ᏞᎩᏁᎾ᙭ ✧'
global.author = 'ᏞᎩᏁᎾ᙭'

global.multiplier = 85

// اكتب رقمك هنا الي عايز تربط بي البوت من دون + او فواصل 
global.botNumberCode = "رقم الربط"

// ========== تيليجرام (تنصيب البوتات الفرعية + لوحة تحكم المالك) ==========
// توكن بوت التيليجرام المستخدم لتنصيب البوتات الفرعية من تيليجرام
global.telegramInstallerToken = "توكن بوت التيليجرام"
// شغّل أو أوقف نظام التنصيب عبر تيليجرام
global.telegramInstallerEnabled = true
// آيدي حساب المالك في تيليجرام (رقم فقط، مش يوزر نيم)
// هيدي رقمك من بوت مثل @userinfobot
// ⚠️ مهم: لازم تحط رقمك هنا، غير كده أي أوامر إدارية خطيرة
// (مسح الجلسات / مسح قاعدة البيانات / ريستارت / إذاعة / نسخة احتياطية)
// هتتقفل ومحدش هيقدر يستخدمها لحد ما تحطه
global.telegramOwnerID = "ايدي المالك في التيليجرام"

// ========== القنوات ==========
global.ch = {
  ch1: 'ايدي القناة 1\@newsletter',
  ch2: 'ايدي القناة 2\@newsletter'
}

// روابط  السوشيال ميديا بتاعتي 
global.yt = 'رابط'
global.ig = 'رابط'
global.md = 'رابط'
global.fb = 'رابط'
global.tk = 'رابط'
global.paypal = 'رابط'
global.soporteGB = 'رابط'

//  ٤١٤×٧٣٦ صور الخطاء لو عايز تغيره بس عشان تكون عارف لزما تكون الصور بي ابعاد مثلا
global.dfailPool = [
    'https://ndrop.hidenfree.com/f/0dccb4e7',
    'https://ndrop.hidenfree.com/f/e4d8d3bb',
    'https://ndrop.hidenfree.com/f/dd7cc3a9',
    'https://ndrop.hidenfree.com/f/ea9271d5',
    'https://ndrop.hidenfree.com/f/be7cbdab',
    'https://ndrop.hidenfree.com/f/0dccb4e7',
    'https://ndrop.hidenfree.com/f/dd7cc3a9',
    'https://ndrop.hidenfree.com/f/e4d8d3bb',
    'https://ndrop.hidenfree.com/f/be7cbdab'
]

// ========== ستايل رفض الصلاحيات (القارئ) ==========
// 'cart' = رسالة عربة تسوق (default) | 'image' = صورة عادية بكابشن
global.dfailStyle = 'cart'

// ========== مراقبة الملف ==========
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
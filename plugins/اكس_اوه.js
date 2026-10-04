// plugins/game-ttt.js
// ✧ ✧ᏌᏒᎪᏁᏌᏚ_ᏰᎾᎿNo.2 Type B - لعبة إكس أو (Tic Tac Toe) ❌⭕

import { theme } from '../System/theme.js';
// KILLUA-QUOTE-OK
const _killuaFake = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: { contactMessage: { displayName: '𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:𝐾𝐼𝐿𝐿𝑈𝐴 𝐵𝑂𝑇🛡️\nEND:VCARD' } }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 كلاس TicTacToe
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class TicTacToe {
    constructor(playerX = 'x', playerO = 'o') {
        this.playerX = playerX;
        this.playerO = playerO;
        this.board = Array(9).fill(null);
        this.currentTurn = playerX;
        this.winner = null;
    }

    render() {
        return this.board.map(cell => {
            if (cell === 'X') return 'X';
            if (cell === 'O') return 'O';
            return cell ? cell : ' ';
        });
    }

    turn(player, pos) {
        if (this.winner) return false;
        if (player !== this.currentTurn) return false;
        if (pos < 0 || pos > 8) return false;
        if (this.board[pos] !== null) return false;
        
        this.board[pos] = player === this.playerX ? 'X' : 'O';
        this.currentTurn = player === this.playerX ? this.playerO : this.playerX;
        
        this.checkWinner();
        return true;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a] === 'X' ? this.playerX : this.playerO;
                return;
            }
        }
        
        if (this.board.every(cell => cell !== null)) {
            this.winner = 'draw';
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎮 أمر اللعبة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let handler = async (m, { conn, usedPrefix, command, text }) => {
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

    
    conn.game = conn.game ? conn.game : {};
    
    // التحقق إذا كان المستخدم بالفعل في لعبة
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
        return conn.reply(m.chat, theme.build([
            { type: 'title', text: '⚠️ تـنـبـيـه' },
            { type: 'subtitle', text: 'أنت بالفعل في لعبة قائمة حالياً!' },
            { type: 'divider' },
            { type: 'line', text: '⚔️ أنهِ لعبتك الحالية أولاً' }
        ]), m);
    }

    // البحث عن غرفة في انتظار خصم
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true));

    if (room) {
        // انضمام لاعب ثاني
        await conn.reply(m.chat, theme.build([
            { type: 'title', text: '✅ بـدأ الـلـعـب' },
            { type: 'subtitle', text: 'تم إيجاد خصم! بدأت اللعبة' },
            { type: 'divider' },
            { type: 'info', label: 'اللاعب الأول', value: 'يبدأ باللعب' },
            { type: 'info', label: 'ملاحظة', value: 'اكتب رقم المربع للعب (1-9)' }
        ]), m);
        
        room.o = m.chat;
        room.game.playerO = m.sender;
        room.state = 'PLAYING';
        
        // عرض لوحة اللعب
        let arr = room.game.render().map(v => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
            }[v];
        });

        let str = theme.build([
            { type: 'title', text: '🎮 لـعـبـة إكـس أو ❌⭕' },
            { type: 'divider' },
            { type: 'info', label: '📋 الـغـرفـة', value: room.id },
            { type: 'divider' },
            { type: 'line', text: '🎯 *الـسـاحـة:*' },
            { type: 'spacer' },
            { type: 'line', text: `${arr.slice(0, 3).join(' ')}` },
            { type: 'line', text: `${arr.slice(3, 6).join(' ')}` },
            { type: 'line', text: `${arr.slice(6).join(' ')}` },
            { type: 'divider' },
            { type: 'info', label: '⚔️ دور', value: '@' + room.game.currentTurn.split('@')[0] },
            { type: 'line', text: '📌 اكتب رقم المربع (1-9) للعب' }
        ]);

        await conn.sendMessage(room.x, { text: str, mentions: [room.game.currentTurn] }, { quoted: m });
        if (room.x !== room.o) await conn.sendMessage(room.o, { text: str, mentions: [room.game.currentTurn] }, { quoted: m });

    } else {
        // إنشاء غرفة جديدة
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        };
        if (text) room.name = text;
        
        await conn.reply(m.chat, theme.build([
            { type: 'title', text: '🔍 بـحـث عـن خـصـم' },
            { type: 'subtitle', text: 'في انتظار شريك للعب...' },
            { type: 'divider' },
            { type: 'info', label: '📌', value: `اطلب من صديقك كتابة ${usedPrefix}${command} ${text ? text : ''}` },
            { type: 'divider' },
            { type: 'line', text: ' 🪐 سيبدأ اللعب عند إيجاد خصم' }
        ]), m);
        
        conn.game[room.id] = room;
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 معالج حركات اللاعبين
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

handler.before = async (m, { conn }) => {
    conn.game = conn.game ? conn.game : {};
    if (!m.isGroup) return false;
    
    let room = Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state === 'PLAYING');
    
    if (room) {
        let pos = parseInt(m.text);
        if (isNaN(pos)) return false;
        if (pos < 1 || pos > 9) return false;
        
        let { game, x, o } = room;
        if (game.currentTurn !== m.sender) {
            await conn.reply(m.chat, theme.build([
                { type: 'title', text: '⚠️ لـيـس دورك' },
                { type: 'subtitle', text: 'انتظر دورك في اللعب' }
            ]), m);
            return true;
        }
        
        if (game.turn(game.currentTurn === game.playerX ? 'X' : 'O', pos - 1)) {
            let arr = game.render().map(v => {
                return {
                    X: '❌',
                    O: '⭕',
                    1: '1️⃣',
                    2: '2️⃣',
                    3: '3️⃣',
                    4: '4️⃣',
                    5: '5️⃣',
                    6: '6️⃣',
                    7: '7️⃣',
                    8: '8️⃣',
                    9: '9️⃣',
                }[v];
            });
            
            let str = theme.build([
                { type: 'title', text: '🎮 لـعـبـة إكـس أو ❌⭕' },
                { type: 'divider' },
                { type: 'line', text: '🎯 *الـسـاحـة:*' },
                { type: 'spacer' },
                { type: 'line', text: `${arr.slice(0, 3).join(' ')}` },
                { type: 'line', text: `${arr.slice(3, 6).join(' ')}` },
                { type: 'line', text: `${arr.slice(6).join(' ')}` },
                { type: 'divider' },
                { type: 'info', label: '⚔️ دور', value: '@' + game.currentTurn.split('@')[0] }
            ]);
            
            if (room.x !== room.o) {
                await conn.sendMessage(room.x, { text: str, mentions: [game.currentTurn] }, { quoted: m });
                await conn.sendMessage(room.o, { text: str, mentions: [game.currentTurn] }, { quoted: m });
            } else {
                await conn.sendMessage(room.x, { text: str, mentions: [game.currentTurn] }, { quoted: m });
            }
            
            if (game.winner) {
                if (game.winner === 'draw') {
                    await conn.reply(m.chat, theme.build([
                        { type: 'title', text: '🤝 تـعـادل 🤝' },
                        { type: 'subtitle', text: 'اللعبة انتهت بالتعادل!' }
                    ]), m);
                } else {
                    let winner = game.winner === 'X' ? game.playerX : game.playerO;
                    await conn.reply(m.chat, theme.build([
                        { type: 'title', text: '🎉 فـائـز 🎉' },
                        { type: 'subtitle', text: `@${winner.split('@')[0]} فاز باللعبة!` },
                        { type: 'divider' },
                        { type: 'info', label: 'الجائزة', value: '+500 نقطة' }
                    ]), m, { mentions: [winner] });
                    
                    if (!global.db.data.users[winner].points) global.db.data.users[winner].points = 0;
                    global.db.data.users[winner].points += 500;
                }
                delete conn.game[room.id];
            }
        } else {
            await conn.reply(m.chat, theme.build([
                { type: 'title', text: '❌ خـطـأ' },
                { type: 'subtitle', text: 'المربع مشغول أو غير موجود' }
            ]), m);
        }
        return true;
    }
    return false;
};

handler.help = ['اكس_او', 'ttt'];
handler.tags = ['game'];
handler.command = /^(اكس_او|ttt|tic)$/i;

export default handler;
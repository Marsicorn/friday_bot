const Telegraf = require('telegraf');
const {
    getMessageWeekDay,
    getSenderId,
    getStickerId
} = require('./utils/index');

const { STICKERS_ID }  = require('./utils/constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHATS = [];

bot.start(ctx => {
    const chatId = getSenderId(ctx);
    const chat = CHATS.find(chat => chat.id === chatId);
    if (typeof chat !== 'undefined') {
        chat.offeredPartyThatWeek = false;
    } else CHATS.push({
        id: chatId,
        offeredPartyThatWeek: false
    });
    return ctx.reply('Йоу! Я здесь, чтобы вы не пропустили ни одного викли ретро')
});

bot.hears(/пя+тни+[цч]/i, ctx => {
    const chat = CHATS.find(chat => chat.id === getSenderId(ctx));
    if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) <= 5) {
        ctx.replyWithSticker(STICKERS_ID.FRIDAY);
        chat.offeredPartyThatWeek = true;
        return ctx.reply('Давайте тусить!');
    }
});

bot.hears(/ви+н(чи+к|и+шк+)?[оауе]?/i, ctx => {
    ctx.replyWithSticker(STICKERS_ID.WINE);
});

bot.on('text', ctx => {
    const chat = CHATS.find(chat => chat.id === getSenderId(ctx));
    if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) === 5) {
        ctx.replyWithSticker(STICKERS_ID.FRIDAY);
        chat.offeredPartyThatWeek = true;
        return ctx.reply('Настолько скоро, что уже! Го тусить!');
    }
});

bot.on('sticker', ctx => {
    if (getStickerId(ctx) === STICKERS_ID.FRIDAY) {
        return ctx.replyWithSticker(STICKERS_ID.BEER);
    }
});

bot.startPolling();
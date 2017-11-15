const Telegraf = require('telegraf');
const { getMessageWeekDay, getSenderId } = require('./utils/index');
const FRIDAY_STICKER_ID = 'CAADAgADHAADRq-QAvZvsAXDQGS1Ag';

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

bot.hears(/пя+тни+ц|ч/i, ctx => {
    const chat = CHATS.find(chat => chat.id === getSenderId(ctx));
    if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) <= 5) {
        ctx.replyWithSticker(FRIDAY_STICKER_ID);
        chat.offeredPartyThatWeek = true;
        return ctx.reply('Давайте тусить!');
    }
});

bot.on('text', ctx => {
    const chat = CHATS.find(chat => chat.id === getSenderId(ctx));
    if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) === 5) {
        ctx.replyWithSticker(FRIDAY_STICKER_ID);
        chat.offeredPartyThatWeek = true;
        return ctx.reply('Настолько скоро, что уже! Го тусить!');
    }
});

bot.startPolling();
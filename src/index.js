const Telegraf = require('telegraf');
const { getCtxWeekDay } = require('./utils/index');
const FRIDAY_STICKER_ID = 'CAADAgADHAADRq-QAvZvsAXDQGS1Ag';

const bot = new Telegraf(process.env.BOT_TOKEN);
let spokeThatWeek = false;

bot.start(ctx => {
    return ctx.reply('Йоу! Я здесь, чтобы вы не пропустили ни одного викли ретро')
});

bot.hears(/пятниц/i, ctx => {
    if (!spokeThatWeek && getCtxWeekDay(ctx) <= 5) {
        ctx.replyWithSticker(FRIDAY_STICKER_ID);
        ctx.reply('Давайте тусить!');
        spokeThatWeek = true;
    }
});

bot.on('text', ctx => {
    if (!spokeThatWeek && getCtxWeekDay(ctx) === 5) {
        ctx.replyWithSticker(FRIDAY_STICKER_ID);
        ctx.reply('Настолько скоро, что уже! Го тусить!');
        spokeThatWeek = true;
    }
});

bot.startPolling();
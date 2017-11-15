const Telegraf = require('telegraf');
const FRIDAY_STICKER_ID = 'CAADAgADHAADRq-QAvZvsAXDQGS1Ag';

const bot = new Telegraf(process.env.BOT_TOKEN);
let spokeThatWeek = false;

bot.start(ctx => {
    return ctx.reply('Йоу! Я здесь, чтобы вы не пропустили ни одного викли ретро')
});

bot.hears(/пятниц/i, ctx => {
    let messageDate = new Date(ctx.update.message.date * 1000);
    if (!spokeThatWeek && messageDate.getDay() <= 5) {
        ctx.replyWithSticker(FRIDAY_STICKER_ID);
        ctx.reply('Давайте тусить!');
        spokeThatWeek = true;
    }
});


bot.startPolling();
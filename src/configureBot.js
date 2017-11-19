const { STICKERS_ID }  = require('./utils/constants');
const {
    getMessageWeekDay,
    getSenderId,
    getStickerId
} = require('./utils/index');


module.exports = function(bot, db) {
    bot.start(ctx => {
        const chatId = getSenderId(ctx);

        getChat(chatId)
            .then(chat => ctx.reply('Йоу! Я здесь, чтобы вы не пропустили ни одного викли ретро'))
            .catch(err => {
                console.error(err);
                ctx.reply('Привет! Что-то пошло не так, попробуйте послать мне команду \/start');
            });
    });

    bot.on('text', ctx => {
        const chatId = getSenderId(ctx);
        getChat(chatId)
            .then(chat => {
                if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) === 5) {
                    ctx.replyWithSticker(STICKERS_ID.FRIDAY);
                    ctx.reply('Настолько скоро, что уже! Го тусить!');
                    return updateChat({ 'chat_id': chatId }, { $set:{ 'offeredPartyThatWeek': true }});
                }
            })
            .catch(err => console.error(err));
    });

    bot.hears(/пя+тни+[цч]/i, ctx => {
        const chatId = getSenderId(ctx);
        getChat(chatId)
            .then(chat => {
                if (!chat.offeredPartyThatWeek && getMessageWeekDay(ctx) <= 5) {
                    ctx.replyWithSticker(STICKERS_ID.FRIDAY);
                    ctx.reply('Давайте тусить!');
                    return updateChat({ 'chat_id': chatId }, { $set:{ 'offeredPartyThatWeek': true }});
                }
            })
            .catch(err => console.error(err));
    });

    bot.hears(/ви+н(чи+к|и+шк+)?[оауе]?/i, ctx => {
        ctx.replyWithSticker(STICKERS_ID.WINE);
    });

    bot.on('sticker', ctx => {
        if (getStickerId(ctx) === STICKERS_ID.FRIDAY) {
            return ctx.replyWithSticker(STICKERS_ID.BEER);
        }
    });

    bot.mention('marsicorn', ctx => {
        return ctx.replyWithSticker(STICKERS_ID.BEER);
    });


    function updateChat(rule, newValue) {
        return new Promise((resolve, reject) => {
            db.collection('chats').update(rule, newValue, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        })
    }

    function getChat(chatId) {
        return new Promise((resolve, reject) => {
            db.collection('chats').findOne({ 'chat_id' : chatId }, (err, item) => {
                if (err) reject(err);
                if (item === null) {
                    db.collection('chats').insert({
                        'chat_id' : chatId,
                        offeredPartyThatWeek: false
                    }, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    })
                } else resolve(item);
            })
        })
    }
};
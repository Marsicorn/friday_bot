const Telegraf = require('telegraf');

const configureBot = require('./configureBot');
const initDatabase = require('./initDatabase');


const bot = new Telegraf(process.env.BOT_TOKEN);

initDatabase()
    .then((db) => {
        configureBot(bot, db);
        bot.startPolling();
    })
    .catch(err => console.error(err));

exports.getMessageWeekDay = function(ctx) {
    let messageDate = new Date(ctx.update.message.date * 1000);
    return messageDate.getDay();
};

exports.getSenderId = function (ctx) {
    return ctx.update.message.from.id;
};

exports.getStickerId = function(ctx) {
    return ctx.update.message.sticker.file_id;
};
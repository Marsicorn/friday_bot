exports.getCtxWeekDay = function(ctx) {
    let messageDate = new Date(ctx.update.message.date * 1000);
    return messageDate.getDay();
};
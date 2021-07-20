// 引用linebot SDK
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
    channelId: '1656231421',
    channelSecret: '76a2d94b3ed2c7e0ed33d5700c1883a5',
    channelAccessToken: 'vkB5D5SxgqQxP1xGeSCs7+//PyCFtx+t+bu41aiCdo3Ty8cu8NPh24/BbByGkQJ91KSuY1cOtI55EOntGm4lBQsTMe9e6Cr+K9nyDX8S+SRpfvnJjtp2eQClPl2XeyQ/n1W2WJtJzD5OVNUKH5HMtgdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息 
    // 準備要回傳的內容 
    var replyMsg = `Hello你剛才說的是:${event.message.text}`;
    // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者 
    event.reply(replyMsg).then(function (data) {
        // 當訊息成功回傳後的處理 
    }).catch(function (error) {
        // 當訊息回傳失敗後的處理 
    });
});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});
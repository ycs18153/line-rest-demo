const bot = require('./botConfig.js');
const Todo = require('./model.js');
const mongoose = require('mongoose');

const Todo = mongoose.model('todoList', todoSchema);

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.gitsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true }
).then(() => console.log('MongoDB connected!')
).catch(err => console.log(err));

bot.on('message', function (event) {
    if (event.message.type == 'text') {
        var msg_txt = event.message.text;
        var user_id = event.source.userID;

        event.reply(msg_txt);
    }
})

const linebotParser = bot.parser();
module.exports = linebotParser

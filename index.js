const apis = require('./restAPI');
const line = require('@line/bot-sdk');
var express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const router = require('./restAPI');
const config = {
    channelAccessToken: 'vkB5D5SxgqQxP1xGeSCs7+//PyCFtx+t+bu41aiCdo3Ty8cu8NPh24/BbByGkQJ91KSuY1cOtI55EOntGm4lBQsTMe9e6Cr+K9nyDX8S+SRpfvnJjtp2eQClPl2XeyQ/n1W2WJtJzD5OVNUKH5HMtgdB04t89/1O/w1cDnyilFU=',
    channelSecret: '76a2d94b3ed2c7e0ed33d5700c1883a5'
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
const app = express();
app.use(bodyParser.json(), apis);

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
    console.log(req, res)
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
    if (event.message.text.search("get")) {
        apis.get((err, res) => {
            if (err) throw err;
            return client.replyMessage(event.replyToken, res);
        });
    }
    else {
        // create a echoing text message
        const echo = {
            type: 'text',
            text: event.message.text
        };
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    }
}

//#region Listening
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
//#endregion


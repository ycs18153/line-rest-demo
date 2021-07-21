'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoClient = require('mongodb').MongoClient;

// create LINE SDK config from env variables
const config = {
    channelAccessToken: 'vkB5D5SxgqQxP1xGeSCs7+//PyCFtx+t+bu41aiCdo3Ty8cu8NPh24/BbByGkQJ91KSuY1cOtI55EOntGm4lBQsTMe9e6Cr+K9nyDX8S+SRpfvnJjtp2eQClPl2XeyQ/n1W2WJtJzD5OVNUKH5HMtgdB04t89/1O/w1cDnyilFU=',
    channelSecret: '76a2d94b3ed2c7e0ed33d5700c1883a5'
};

// for Atlas connection.
const url = 'mongodb+srv://admin:admin@cluster0.gitsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
var database;
var collection;

const todoRoute = require('./src/api/routes/todoRoute');

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
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

    // create a echoing text message
    const echo = {
        type: 'text',
        text: event.message.text + ' ' + collection
    };

    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.log(err);
        database = client.db('myFirstDatabase');
        collection = database.collection('todoList');
        console.log(`Connect to ${database}, and the collection here is ${collection}`);
    })
});

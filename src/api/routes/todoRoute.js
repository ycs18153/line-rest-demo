const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const todoModel = require('../models/todoModel');

const router = express.Router();
router.use(bodyParser.json());

var database, collection;
const url = 'mongodb+srv://admin:admin@cluster0.gitsk.mongodb.net/myFirstDatabase?retryWrites=true';
mongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, client) => {
    if (err) return console.log(err);
    database = client.db('myFirstDatabase');
    collection = database.collection('todoList');
    console.log(`Connect to ${database}, and the collection here is ${collection}`);
})

/* 
 * Post Method
 * Note: the sample request is provided above (region).   
 */
router.post('/', async (req, res) => {
    console.log(req.body); //your json
    database.collection('todo').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to mongoDB');
        res.send(req.body);
    })
})

/* Get Method */
router.get('/', (req, res) => {
    database.collection('todo').find().toArray((err, result) => {
        if (err) throw err;
        console.log('GET successful!');
        res.send({ data: result });
    })
});

/* Delete Method */
router.delete('/:id', (req, res) => {
    // use _id need use ObjectID(value)
    const obj = { _id: ObjectID(req.params.id) };
    database.collection('todo').remove(obj, (err, result) => {
        if (err) throw err;
        console.log('1 document deleted');
        res.send('delete success');
    })
})

/* Put Method */
router.put('/:id', (req, res) => {
    console.log(req.params.id, req.body);
    const newvalues = { $set: req.body };
    const obj = { _id: ObjectID(req.params.id) };
    database.collection('todo').updateOne(obj, newvalues, (err, result) => {
        if (err) throw err;
        console.log("1 document update");
        res.send('update success');
    })
})

module.exports = router;
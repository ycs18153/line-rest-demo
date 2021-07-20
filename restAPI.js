const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();

const port = 3000;
router.use(bodyParser.json());

const url = 'mongodb+srv://admin:admin@cluster0.gitsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoClient.connect(url, (err, client) => {
    if (err) return console.log(err)
    db = client.db('myFirstDatabase')
    router.listen(port, () => {
        console.log('listening on 3000')
    })
})

/* 
 * Post Method
 * Note: the sample request is provided above (region).   
 */
router.post('/comments', (req, res) => {
    console.log(req.body); //your json
    db.collection('comments').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to mongoDB');
        res.send(req.body);
    })
})

/* Get Method */
router.get('/comments', (req, res) => {
    db.collection('comments').find().toArray((err, result) => {
        if (err) throw err;
        console.log('GET successful!');
        res.send({ data: result });
    })
})

/* Delete Method */
router.delete('/comments/:id', (req, res) => {
    // use _id need use ObjectID(value)
    const obj = { _id: ObjectID(req.params.id) };
    db.collection('comments').remove(obj, (err, result) => {
        if (err) throw err;
        console.log('1 document deleted');
        res.send('delete success');
    })
})

/* Put Method */
router.put('/comments/:id', (req, res) => {
    console.log(req.params.id, req.body);
    const newvalues = { $set: req.body };
    const obj = { _id: ObjectID(req.params.id) };
    db.collection('comments').updateOne(obj, newvalues, (err, result) => {
        if (err) throw err;
        console.log("1 document update");
        res.send('update success');
    })
})

/* Rendering homepage. */
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

module.exports = router;
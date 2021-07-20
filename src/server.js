const express = require('express');
const bodyParser = require('body-parser');

// Import DB Connection
require("./config/db");

// create express app
const app = express();

// define port to run express app
const port = process.env.PORT || 8000;

// use bodyParser middleware on express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add endpoint
app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
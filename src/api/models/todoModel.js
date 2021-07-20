const mongoose = require('mongoose')

const schema = mongoose.Schema;

const todoSchema = new schema({
    text: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

// create and export model
module.exports = mongoose.model('todoModel', todoSchema);
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todoID: {
        type: String,
        require: true
    },
    todoCreateDate: {
        type: Date,
        default: Date.now
    },
    todoDescribe: {
        type: String,
        default: ''
    },
    todoFinished: {
        type: Boolean,
        default: false
    }
});

// collection name 'todoList' in Atlas
const Todo = mongoose.model('todoList', todoSchema);

model.exports = Todo;
const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
        q1: {type : Boolean},
        q2: {type : Boolean},
        q3: {type : Boolean},
        q4: {type : Boolean},
        q5: {type : Boolean}
});

// Define Board schema
const boardSchema = new mongoose.Schema({
    _boardId : String,
    _cat1 : answersSchema,
    _cat2 : answersSchema,
    _cat3 : answersSchema,
    _cat4 : answersSchema,
    _cat5 : answersSchema,
    _cat6 : answersSchema,
});

module.exports = mongoose.model('Board', boardSchema);
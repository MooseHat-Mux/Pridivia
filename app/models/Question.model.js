const mongoose = require('mongoose');

// Define Question schema
const questionSchema = new mongoose.Schema(
    { _active: {
        type: Boolean,
        required: true,
    }},
    { _difficulty: {
        type: Number, required: true
    }},
    { _question: {
        type: String,
        required: true,
        unique: true,
    }},
    {_correctAnswer: {
        type: String,
        require: true
    }},
    {_answers: [
        { _answer1: String},
        { _answer2: String},
        { _answer3: String},
        { _answer4: String}
    ]}
);

// Create the Question model from the schema
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
const mongoose = require('mongoose');

// Define Question schema
const questionSchema = new mongoose.Schema(
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
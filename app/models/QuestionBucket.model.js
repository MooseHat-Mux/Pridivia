const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    _answer1: {type: String, required: true},
    _answer2: {type: String, required: true},
    _answer3: {type: String, required: true},
    _answer4: {type: String, required: true}
});

// Define Question schema
const questionSchema = new mongoose.Schema({
    _category: { type: Number,
        required: true
    },
    _difficulty: { type: Number,
        required: true
    },
     _question: {
        type: String,
        required: true,
        unique: true,
    },
    _correctAnswer: {
        type: String,
        require: true
    },
    _answers: answerSchema
});

// // Define Question Bucket schema
// const questionBucketSchema = new mongoose.Schema({
//     _category : Number,
//     _bucket : [ questionSchema ]
// });

module.exports = mongoose.model('QuestionBucket', questionSchema);
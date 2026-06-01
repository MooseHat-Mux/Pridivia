const mongoose = require('mongoose');
const Question = require('./Question.model');

// Define Question Bucket schema
const questionBucketSchema = new mongoose.Schema(
    { _category : Number },
    { _difficulty: Number },
    { _possibleQuestions : [Question] }
);

module.exports = mongoose.model('QuestionBucket', questionBucketSchema);
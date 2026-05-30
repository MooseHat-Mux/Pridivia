const mongoose = require('mongoose');

// Define Question Bucket schema
const questionBucketSchema = new mongoose.Schema(
    { _category : Number },
    { _difficulty: Number },
    { _possibleQuestions : [new Question()] }
);

// Create the Question Bucket model from the schema
const QuestionBucket = mongoose.model('QuestionBucket', questionBucketSchema);
module.exports = QuestionBucket;
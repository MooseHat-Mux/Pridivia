const mongoose = require('mongoose');

// Define Chatter schema
const chatterSchema = new mongoose.Schema(
    {_username: {
        type: String,
        required: true,
        unique: true
    }},
    {_clan: {
        type: String,
        required: true      
    }},
    {_createdAt: {
        type: Date,
        default: Date.now,
    }}
);

module.exports = mongoose.model('Chatter', chatterSchema);
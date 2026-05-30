const mongoose = require('mongoose');

// Define Chatter schema
const chatterSchema = new mongoose.Schema(
    {_id: {
        type: Int16Array,
        required: true,
        unique: true,
    }},
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

// Create the Chatter model from the schema
const Chatter = mongoose.model('Chatter', chatterSchema);
module.exports = Chatter;
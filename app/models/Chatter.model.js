const mongoose = require('mongoose');

// Define Chatter schema
const chatterSchema = new mongoose.Schema({
    _userid:{
        type: Number,
        required: true,
        unique: true
    },
    _discordid:{
        type: Number
    },
    _username: {
        type: String
    },
    _clan: {
        type: String,
        default: 'mortal'    
    },
    _createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chatter', chatterSchema);
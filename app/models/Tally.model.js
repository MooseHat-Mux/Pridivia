const mongoose = require('mongoose');

// Define Tally schema
const tallySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    _tallyid: { type: String, required: true },
    _jester: { type: Number, required: true},
    _dragon: { type: Number, required: true},
    _vampire: { type: Number, required: true},
    _gargoyle: { type: Number, required: true},
    _warlock: { type: Number, required: true},
    _thrall: { type: Number, required: true},
    _lycan: { type: Number, required: true},
    _mortals: { type: Number, required: true}
});

module.exports = mongoose.model('Tally', tallySchema);
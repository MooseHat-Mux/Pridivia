const mongoose = require('mongoose');

// Define Tally schema
const tallySchema = new mongoose.Schema({
    id: { type: String, required: true },
    jester: { type: Number, required: true},
    dragon: { type: Number, required: true},
    vampire: { type: Number, required: true},
    gargoyle: { type: Number, required: true},
    warlock: { type: Number, required: true},
    thrall: { type: Number, required: true},
    lycan: { type: Number, required: true},
    mortals: { type: Number, required: true}
});

// Create the Tally model from the schema
const Tally = mongoose.model('Tally', tallySchema);
module.exports = Tally;
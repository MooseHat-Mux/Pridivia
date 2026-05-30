const mongoose = require('mongoose');

// Define Board schema
const boardSchema = new mongoose.Schema(
    {_boardId : String},
    {_cat1 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]},
    {_cat2 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]},    
    {_cat3 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]},    
    {_cat4 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]},    
    {_cat5 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]},    
    {_cat6 : [ 
        { q1: {type : Boolean}},
        { q2: {type : Boolean}},
        { q3: {type : Boolean}},
        { q4: {type : Boolean}},
        { q5: {type : Boolean}}
    ]}
);

// Create the Board model from the schema
const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
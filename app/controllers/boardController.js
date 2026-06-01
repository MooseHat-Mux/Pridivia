const Board = require("../models/Board.model");

exports.index = async(req, res, next) =>{
    res.SendFile('../public/index.html', (err) =>{
        if(err){
            console.log('Error sending file :: ', err);
            res.status(500).send('File not found');
        }
        else{
            console.log('Sent:', 'Board Page');
        }
    });
}
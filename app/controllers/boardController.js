const Board = require("../models/Board.model");
const path = require("path");
const mongoose = require('mongoose');
const jeopargayuri = process.env.JEOPARGAYURI;

exports.index = async(req, res, next) =>{
    console.log('Get:', 'Board Page');
    // const currentBoard = await getBoard();                
    // console.log('Got:', 'Board Page');
    
    var indexPath = path.join(__dirname, '../../public/views/index.html');
    //res.render('index', { board : currentBoard});

    res.sendFile(indexPath);
}

exports.board_data = async(req, res, next) =>{
    try{
        console.log('Get:', 'Board Data');
        let currentBoard = await Board.findOne({ _boardId : "board" });                
        console.log('Got:', 'Board Data');
        console.log(currentBoard);

        return res.status(200).json({ 
            status: 'success', 
            data : { currentBoard }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

async function getBoard(){
    mongoose.connection.useDb(jeopargayuri);
    
    await Board.findOne({ _boardId : "board" }).then(function(boardResult) {
        console.log(`Found Board`);
        console.log(boardResult);
        
        return boardResult;
    });
}
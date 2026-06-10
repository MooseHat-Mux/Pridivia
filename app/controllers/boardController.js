const Board = require("../models/Board.model");
const path = require("path");
const mongoose = require('mongoose');
const jeopargayuri = process.env.JEOPARGAYURI;

exports.index = async(req, res, next) =>{
    console.log('Get:', 'Board Page');
    
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

exports.update_board = async(req, res, next) =>{
    try{
        console.log('Get:', 'Update Board Data');
        let newboard_data = JSON.parse(req.body);
        console.log(`Request body ${req.body}`);
        const catIndex = Number(newboard_data._category) + 1;
        const diffIndex = Number(newboard_data._difficulty) + 1;

        const category = "_cat" + catIndex;
        const question = "q" + diffIndex;
        console.log(`Update Board ${category} ${question}`);
        let currentBoard = await Board.findOne({ _boardId : "board" });
        currentBoard[category][question] = false;
        await currentBoard.save();

        //let currentBoard = await Board.updateOne({ _boardId : "board", category: {question : false} });                
        console.log('Got:', 'Updated Board Data');
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

exports.reset_board = async(req, res, next)=>{
    try{
        console.log('Get:', 'Reset Board');
        
        let currentBoard = await Board.findOne({ _boardId : "board" });
        currentBoard._cat1.q1 = true;
        currentBoard._cat1.q2 = true;
        currentBoard._cat1.q3 = true;
        currentBoard._cat1.q4 = true;
        currentBoard._cat1.q5 = true;
        currentBoard._cat2.q1 = true;
        currentBoard._cat2.q2 = true;
        currentBoard._cat2.q3 = true;
        currentBoard._cat2.q4 = true;
        currentBoard._cat2.q5 = true;
        currentBoard._cat3.q1 = true;
        currentBoard._cat3.q2 = true;
        currentBoard._cat3.q3 = true;
        currentBoard._cat3.q4 = true;
        currentBoard._cat3.q5 = true;
        currentBoard._cat4.q1 = true;
        currentBoard._cat4.q2 = true;
        currentBoard._cat4.q3 = true;
        currentBoard._cat4.q4 = true;
        currentBoard._cat4.q5 = true;
        currentBoard._cat5.q1 = true;
        currentBoard._cat5.q2 = true;
        currentBoard._cat5.q3 = true;
        currentBoard._cat5.q4 = true;
        currentBoard._cat5.q5 = true;
        currentBoard._cat6.q1 = true;
        currentBoard._cat6.q2 = true;
        currentBoard._cat6.q3 = true;
        currentBoard._cat6.q4 = true;
        currentBoard._cat6.q5 = true;

        await currentBoard.save();
        console.log('Got:', 'Reset Board Data');
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
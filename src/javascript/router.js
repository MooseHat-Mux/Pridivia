const express = require('express');
const router = express.Router();
const server = require("../../server");

router.get('/', (req, res) =>{
    try{
        const currentBoard = await server.getBoard();
        res.status(200).json({currentBoard});
        res.send("Jeopargay Home Page");
    } catch(err){
        res.status(500).json({ msg: err });
    }
});

router.get('/question', (req, res) =>{
    try{
        const currentBoard = await server.retrieveQuestion();
        res.status(200).json({currentBoard});
        res.send("Jeopargay Home Page");
    } catch(err){
        res.status(500).json({ msg: err });
    }
});

router.post('/answer', (req, res) =>{
    try{
        const currentAnswers = await server.checkAnswers();
        res.status(200).json({currentAnswers});
        res.send("Current Answers received");
    } catch(err){
        res.status(500).json({ msg: err });
    }
});

router.post('/newquestion', (req, res) =>{
    try{
        const thisBucket = QuestionBucket.find({_category : req.body._category, _difficulty : req.body._difficulty});

        if(!thisBucket){
            console.log('No bucket found making a new one');

            QuestionBucket.create({
                _category : req.body._category,
                _difficulty : req.body._difficulty,
                _possibleQuestions : [req.body._newQuestion]
            });
        }
        res.status(201).json({thisBucket});
    } catch(err){
        res.status(500).json({ msg: err });
    }
});

router.get('/tally', (req, res) =>{
    try{
        const currentTally = await server.checkTally();
        res.status(200).json({currentTally});
        res.send("Jeopargay Tally Page");
    } catch(err){
        res.status(500).json({ msg: err });
    }
});

module.exports = router;
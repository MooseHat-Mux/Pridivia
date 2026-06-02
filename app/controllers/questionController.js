const QuestionBucket = require("../models/QuestionBucket.model");
const Question = require("../models/Question.model");
const path = require("path");
const mongoose = require('mongoose');
const jeopargayuri = process.env.JEOPARGAYURI;

exports.question_page = async(req, res, next) =>{
    console.log('Get:', 'Question Page');
        
    var indexPath = path.join(__dirname, '../../public/views/question.html');
    res.sendFile(indexPath);
}

exports.display_question = async(req, res, next) =>{
    try{
        console.log('Get:', 'Question Data');
        console.log(req.body);

        let newQuestion = await QuestionBucket.findOne({ _category : "1", _difficulty : "1" });                
        console.log('Got:', 'Question Data');
        console.log(newQuestion);

        return res.status(200).json({ 
            status: 'success', 
            data : { newQuestion }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.answer_question = async(req, res, next) =>{
    
}

exports.update_questionbucket = async(req, res, next) =>{
    try{
        console.log('Get:', 'New Question Data');
        console.log(req.body);

        let newQuestion = await QuestionBucket.findOneAndUpdate({ _category : "1" });                
        console.log('Got:', 'New Question Data');
        console.log(newQuestion);

        return res.status(200).json({ 
            status: 'success', 
            data : { newQuestion }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}
const QuestionBucket = require("../models/QuestionBucket.model");
const Chatter = require("../models/Chatter.model");
const path = require("path");
const mongoose = require('mongoose');
const jeopargayuri = process.env.JEOPARGAYURI;
require('mongoose-query-random');

exports.question_page = async(req, res, next) =>{
    console.log('Get:', 'Question Page');
        
    var indexPath = path.join(__dirname, '../../public/views/question.html');
    res.sendFile(indexPath);
}

exports.display_question = async(req, res, next) =>{
    try{
        console.log('Get:', 'Question Data');
        let questionQuery = JSON.parse(req.body);
        console.log(`Request body ${JSON.stringify(questionQuery)}}`);

        const filter = { 
            '_category' : questionQuery._category,
            '_difficulty'  : questionQuery._difficulty
        };
        console.log(filter);

        await QuestionBucket.find(filter).random(1, true, function(err, newQuestion){
            if(err) console.log(err);
            console.log('Got:', 'Question Data');
            console.log(newQuestion);

        return res.status(200).json({ 
            status: 'success', 
            data : { newQuestion }});
        });                

    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.answer_question = async(req, res, next) =>{
    
}

exports.add_question = async(req, res, next) =>{
    try{
        console.log('Get:', 'New Question Data');
        let questionBucket = req.body;
        console.log(questionBucket);

        let addedQuestion = await QuestionBucket.create(questionBucket);
        console.log('Got:', 'New Question Data');
        console.log(addedQuestion);

        return res.status(200).json({ 
            status: 'success', 
            data : { addedQuestion }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.update_questionbucket = async(req, res, next) =>{
    try{
        console.log('Get:', 'Update Question Data');
        let questionBucket = req.body;
        console.log(questionBucket);

        const filter = { _category : questionBucket._category, _difficulty: questionBucket._difficulty, _question: questionBucket._question }

        let newQuestion = await QuestionBucket.findOneAndUpdate(filter, questionBucket, {
            upsert: true
        });                
        console.log('Got:', 'Update Question Data');
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

exports.replace_questionbucket = async(req, res, next) =>{
    try{
        console.log('Get:', 'New Question Data');
        let questionBucket = req.body;
        console.log(questionBucket);

        const filter = { _category : questionBucket._category }

        let newQuestion = await QuestionBucket.findOneAndReplace(filter, questionBucket, {
            upsert: true
        });                
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

exports.create_chatter = async(req, res, next) =>{
    try{
        console.log('Get:', 'New Chatter Data');
        let chatterBody = req.body;
        console.log(chatterBody);

        let addedChatter = await QuestionBucket.insertMany(chatterBody);
        console.log('Got:', 'New Chatter Data');
        console.log(addedChatter);

        return res.status(200).json({ 
            status: 'success', 
            data : { addedChatter }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.show_chatters = async(req, res, next) =>{
    try{
        console.log('Get:', 'Chatter Data');
        let currentChatters = await Chatter.find();                
        console.log('Got:', 'Chatter Data');
        console.log(currentChatters);

        return res.status(200).json({ 
            status: 'success',
            data : { currentChatters }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}
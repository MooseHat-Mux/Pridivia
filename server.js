const express = require('express');
require('./config/connection');
const mongoose = require('mongoose');
var ComfyJS = require("comfy.js");
const ComfyDB = require("comfydb");
const path = require("path");
//const compression = require("compression");
const indexRouter = require("./app/routes/index");
const boardRouter = require("./app/routes/board")

var dns = require('dns');
require('dotenv').config();
const port = process.env.PORT;
const creatureuri = process.env.CREATURESURI;
const jeopargayuri = process.env.JEOPARGAYURI;

const Board = require('./app/models/Board.model');
const Question = require('./app/models/Question.model');
const QuestionBucket = require('./app/models/QuestionBucket.model')
const Tally = require('./app/models/Tally.model');
const Chatter = require('./app/models/Chatter.model');

// const newQuestion = new Question({
//     _active : true,
//     _difficulty: 0,
//     _question : '',
//     _correctAnswer: '',
//     _answers: [
//         { _answer1: ''},
//         { _answer2: ''},
//         { _answer3: ''},
//         { _answer4: ''},
//     ]
// });

// var currentTally = new Tally({
//     id: 'Tally',
//     jester: 0,
//     dragon: 0,
//     vampire: 0,
//     gargoyle: 0,
//     warlock: 0,
//     thrall: 0,
//     lycan: 0,
//     mortals: 0
// });

var currentAnswers = [];

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if(command === "test"){
        console.log("Wow you hit a thing!!");
    }

    if(command === "A"){
        addAnswer(user.id, "A");
    }
    else if(command === "B"){
        addAnswer(user.id, "B");
    }
    else if(command === "C"){
        addAnswer(user.id, "C");
    }
    else if(command === "D"){
        addAnswer(user.id, "D");
    }

    if((flags.mod || flags.broadcaster) && command === "clan"){
        console.log(`${message} this is the fucking clan command I guess idk`);
    }
}
ComfyJS.Init("blair");

mongoose.connection.once('open', () =>{
    console.log('Connected to Mongodb');

    var answers = {
        q1: true,
        q2: true,
        q3: true,
        q4: true,
        q5: true
    };

    var baseBoard = {
        _boardId: "board",
        _cat1 : answers,
        _cat2 : answers,
        _cat3 : answers,
        _cat4 : answers,
        _cat5 : answers,
        _cat6 : answers};

    var boardQuery = { _boardId : "board"},
        update = baseBoard,
        options = { upsert : true, returnDocument: 'after'};
        
    mongoose.connection.useDb(jeopargayuri);
    const boardResult = Board.findOneAndUpdate(boardQuery, update, options).then(
        console.log(`Initiated database Board`)
    ).catch(function(err) {
        console.log(`Error initializing board ::`, err);      
    });

    console.log(boardResult);
})

async function updateBoard(catIndex, answerIndex){
    mongoose.connection.useDb(jeopargayuri);
    
    var boardQuery = { _boardId : "board"},
        options = { returnDocument: 'after'};

    try{
        const boardResult = await Board.findOneAndUpdate({ _boardId : "board"}, { catIndex : { answerIndex : false }}, options);
        
        if(boardResult){
            console.log(`Found Board`);
            console.log(boardResult);
        }
    }catch(err)
    {
        console.log(`Error retrieving board ::`, err);      
    }

}

async function checkTally(){
    try{
        const tallyResult = await Tally.findOne({_id : "Tally"});

        if(!tallyResult){
            let newTally = new Tally({
                _id: "Tally",
                jester: 0,
                dragon: 0,
                vampire: 0,
                gargoyle: 0,
                warlock: 0,
                thrall: 0,
                lycan: 0,
                mortals: 0
            });

            let result = await newTally.save();
            console.log(`Found tallies`);
            console.log(result);
        }
        else{
            console.log(`Found tallies`);
            console.log(tallyResult);
        }
    }
    catch(err){
        console.log(err);
    }

    // if(tallyResult){
    //     console.log(`Found tallies`);
    //     console.log(tallyResult);
    // }
    // else {
    //     console.log(`No tallies found, new tally created`);
    //     const zeroTally = await client.db("creatures").collection("JeopargayData").insertOne(currentTally);
        
    //     console.log(zeroTally);
    // }
}

async function retrieveQuestion(client, category, difficulty){
    const questionsResult = await client.db("jeopargay").collection("questions").findOne({_category: category}, {_difficulty: difficulty});
    
    if(questionsResult)
    {
        console.log(`Got a question from cat ${category} at difficulty ${difficulty}`);
        console.log(questionsResult);

        // Randomly pick one of the active questions
        const activeQuestions = questionsResult.filter(question => question.active === true);
        
        if(activeQuestions)
        {
            currentQuestion = activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
        }
        else{
            questionsResult.map(function(question){
                question.active = true;
                return question;
            });

            // Reset Questions
            currentQuestion = questionsResult[Math.floor(Math.random() * activeQuestions.length)];
        }
    }
    else{
        console.log(`No questions found or none are active`);
    }
}

function addAnswer(userId, newAnswer){
    if(!(userId in currentAnswers))
    {
        currentAnswers[userId] = newAnswer;
    }
}

async function checkAnswers(){
    var ids = currentAnswers.map(function(id){ return ObjectId(id); });

    const creatureResult = await client.db("creatures").collection("JeopargayData").find({_id: {$in: ids}});
    const currentTally = 
        { id: "Tally",
            jester: 0,
            dragon: 0,
            vampire: 0,
            gargoyle: 0,
            warlock: 0,
            thrall: 0,
            lycan: 0,
            mortals: 0 };

    for(var key in currentAnswers){
        if(currentAnswers.hasOwnProperty(key)){
            var thisClan = "mortals";

            if(!(key in creatureResult)){
                // Make them mortal
                // Add them to mortals database
            }
            else{
                thisClan = creatureResult.clan;
            }

            if(currentAnswers[key] === currentCorrectAnswer){
                currentTally[clan] += 1;
            }
            else currentTally[clan] -= 1;
        }
    }

    currentAnswers = [];
    updateTallies(client, currentTally);
}


async function updateTallies(client, newTally){
    const tallyResult = await client.db("creatures").collection("JeopargayData").findOne({id: "Tally"});

    if(tallyResult){
        console.log(`Found tallies`);
        console.log(tallyResult);

        const sumTally = sumObjectsByKey(tallyResult, newTally);
        console.log(`Summerized Tallies`);
        console.log(sumTally);
        
        const oldResult = await client.db("creatures").collection("JeopargayData").updateOne({id: "OldTally"}, { $set: tallyResult});
        console.log(`Old tally result in database`);
        console.log(oldResult);
        
        const newResult = await client.db("creatures").collection("JeopargayData").updateOne({id: "Tally"}, { $set: sumTally});
        console.log(`New tally result in database`);
        console.log(newResult);
    }
    else{
        console.log(`Unabled to retrieve tallies`);
    }
}

function uploadQuestion(question){

}

function addToClan(user, clan){

}

function sumObjectsByKey(...objs) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

// This side of the server is communication between serverside and clientside
// All post/get instructions are received here when called from the client

const server = express();
// server.set("views", path.join(__dirname, "public/views"))
// server.set("view engine", "ejs");

server.use(express.json());
server.use(express.static(path.join(__dirname, "public")));

server.use("/", indexRouter);
server.use("/board", boardRouter);

server.listen(port, () => {
    console.log(`public path ${path.join(__dirname, "public")}`);
    console.log("Server started on port 3000");
});

function handleError(err){
    console.log(`Database error ::`, err);      
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
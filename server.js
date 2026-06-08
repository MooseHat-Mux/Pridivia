const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
require('./config/connection');
const mongoose = require('mongoose');
var ComfyJS = require("comfy.js");
const path = require("path");
const indexRouter = require("./app/routes/index");
const boardRouter = require("./app/routes/board");

var dns = require('dns');
require('dotenv').config();
const port = process.env.PORT;
const streamuri = process.env.HERGRACE;
const creatureuri = process.env.CREATURESURI;
const jeopargayuri = process.env.JEOPARGAYURI;
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const Board = require('./app/models/Board.model');
const QuestionBucket = require('./app/models/QuestionBucket.model');
const Tally = require('./app/models/Tally.model');
const Chatter = require('./app/models/Chatter.model');
const jeopargay_started = false;
const currentAnswers = [];

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if(command === "test"){
        console.log("Wow you hit a thing!!");
    }

    if(jeopargay_started){
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
    }

    if((flags.mod || flags.broadcaster) && command === "clan"){
        console.log(`${message} this is the fucking clan command I guess idk`);
    }
}
ComfyJS.Init(streamuri);

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

function addAnswer(userId, username, newAnswer){
    currentAnswers.push({
        _userid: userId,
        _username: username,
        _answer: newAnswer
    });
}

async function checkAnswers(){
    // Get current list of creatures
    const currentCreatures = await Chatter.find();                

    // Get current baseValue based on difficulty
    const difficulty = foundQuestionData._difficulty;
    if(difficulty < 1){
        difficulty++;
    }
    
    const possibleWinnings = baseValue * difficulty;

    // Update missing chatters from received answers
    const newCreatures = [];

    var answerCount = currentAnswers.length;
    for(var i; i < answerCount; i++){
        var thisClan = "mortals";

        if(!(currentAnswers[i]._userId in currentCreatures)){
            // Make them mortal
            // Add them to mortals database
            const chatterData = {
                _userid : key,
                _username : currentAnswers[i]._username,
                _clan : thisClan
            };
            
            newCreatures.push(chatterData);
        }
    }
    
    await calculateCurrentTally(currentTally);
}

async function calculateCurrentTally(updateCreatures){
    const currentCreatures = await fetch('/board/chatters', options).then(chatters => {
        return chatters.json();
    }).then(data => {
        console.log('Data retrieved');
        console.log(data);
    }).catch(err => console.log(err));
    
    // Set base tally
    const currentTally = {
        _jester: 0,
        _dragon: 0,
        _vampire: 0,
        _gargoyle: 0,
        _warlock: 0,
        _thrall: 0,
        _lycan: 0,
        _mortals: 0 
    };

    for(var key in currentCreatures)
    {
        const foundUser = currentAnswers.find((userid) => _userid == currentCreatures[key]._username);

        if(foundUser)
        {
            const thisClan = currentCreatures[key].clan;     
            if(currentCreatures[key]._answer === foundQuestionData._correctanswer){
                currentTally[thisClan]++;
            }
            else currentTally[thisClan] --;
        }
    }

    const clanCount = currentTally.length;
    const totalTally = 0;
    for(var key in currentTally){
        totalTally += currentTally[key];
    }

    for(var key in currentTally){
        if(currentTally[key] != 0)
        {
            var weightedTally = baseValue / currentTally[key];
            var newTally = baseValue * weightedTally;

            currentTally[key] = newTally;
        }
    }
    
    // Clear Answers
    currentAnswers = {};

    currentTally._tallyid = "tally";
    await updateTallies(currentTally);
}

async function updateTallies(newTally){
    const options = {
        method: "POST",
        body: JSON.stringify(newTally)
    };

    const tallyResult = await fetch('/board/tally/update', options)
        .then(tallydisplay => {
            return tallydisplay.json();
        }).then(data => {
            console.log('Tally data retrieved');
            const foundTallyData = data.data.currentTally;
            console.log(foundTallyData);
        });

    if(tallyResult){
        console.log(`Found tallies`);
        console.log(tallyResult);

        // const sumTally = sumObjectsByKey(tallyResult, newTally);
        // console.log(`Summerized Tallies`);
        // console.log(sumTally);
        
        // const oldResult = await client.db("creatures").collection("JeopargayData").updateOne({id: "OldTally"}, { $set: tallyResult});
        // console.log(`Old tally result in database`);
        // console.log(oldResult);
        
        // const newResult = await client.db("creatures").collection("JeopargayData").updateOne({id: "Tally"}, { $set: sumTally});
        // console.log(`New tally result in database`);
        // console.log(newResult);
    }
    else{
        console.log(`Unabled to retrieve tallies`);
    }
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
const chatserver = createServer(server);
const io = new Server(chatserver);
server.use(express.json());
server.use(express.text());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "public")));
server.use(cors());

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
io.on('connection', (socket) =>{
    console.log('master connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.broadcast.emit('chatanswers', currentAnswers);
});
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
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
var jeopargay_started = false;
var currentAnswers = [];

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if(command === "test"){
        console.log("Wow you hit a thing!!");
    }

    //console.log(`${command}`);

    if(jeopargay_started){
        if(command === "a"){
            addAnswer(extra.userId, extra.username, "A");
        }
        else if(command === "b"){
            addAnswer(extra.userId, extra.username, "B");
        }
        else if(command === "d"){
            addAnswer(extra.userId, extra.username, "C");
        }
        else if(command === "d"){
            addAnswer(extra.userId, extra.username, "D");
        }
    }

    if((flags.mod || flags.broadcaster) && command === "creature"){
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
    console.log(`Answer added ${userId} ${username} ${newAnswer}`);
    currentAnswers.push({
        _userid: userId,
        _username: username,
        _answer: newAnswer
    });
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

server.use(express.json());
server.use(express.text());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "public")));
server.use(cors());

server.use("/", indexRouter);
server.use("/board", boardRouter);

const chatserver = createServer(server);
const io = new Server(chatserver);

io.on('connection', (socket) =>{
    console.log('master connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('timer_start', (start) =>{
        jeopargay_started = true;
        console.log(`timer_start called ${jeopargay_started} supposed to be ${start}`);
    });

    socket.on('answer_end',(end) => {
        jeopargay_started = false;
        console.log(`answer_end called ${jeopargay_started} supposed to be ${end}`);
    });

    if(jeopargay_started)
    {
        socket.broadcast.emit('chatanswers', currentAnswers);
    }
});

chatserver.listen(port, () => {
    console.log(`public path ${path.join(__dirname, "public")}`);
    console.log("Server started on port 3000");
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
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
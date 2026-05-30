const express = require('express');
const { MongoClient } = require('mongodb');
var ComfyJS = require("comfy.js");
const ComfyDB = require("comfydb");
var dns = require('dns');
require('dotenv').config();
const client = new MongoClient(process.env.MONGOMOOSEURI);

const Board = require('./app/models/Board.model');
const Question = require('./app/models/Question.model');
const QuestionBucket = require('./app/models/QuestionBucket.model')
const Chatter = require('./app/models/Chatter.model');
const Tally = require('./app/models/Tally.model');

const newChatter = new Chatter({
    _id: 0,
    _username: '',
    _clan: ''
});

const newQuestion = new Question({
    _active : true,
    _difficulty: 0,
    _question : '',
    _correctAnswer: '',
    _answers: [
        { _answer1: ''},
        { _answer2: ''},
        { _answer3: ''},
        { _answer4: ''},
    ]
});

const questionBueckt = new QuestionBucket({
    _category = 0,
    _difficulty = 0,
    _possibleQuestions : [newQuestion]
});

var currentBoard = new Board({
    _boardId : 'board',
    _cat1 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
    _cat2 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
    _cat3 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
    _cat4 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
    _cat5 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
    _cat6 : [
        { q1 : true },
        { q2 : true },
        { q3 : true },
        { q4 : true },
        { q5 : true }
    ],
});

var currentTally = new Tally({
    id: 'Tally',
    jester: 0,
    dragon: 0,
    vampire: 0,
    gargoyle: 0,
    warlock: 0,
    thrall: 0,
    lycan: 0,
    mortals: 0
});

var currentCorrectAnswer = "L";
var currentQuestion = newQuestion;
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

(async() =>{
    // console.log(await dns.getServers());
    // require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await checkTally(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
})();

async function getBoard(client){
    const boardResult = await client.db("creatures").collection("JeopargayData").findOne({_boardId: "board"});

    if(boardResult){
        console.log(`Found Board`);
        console.log(boardResult);
        currentBoard = boardResult;
    }
    else {
        console.log(`No board found, new board created`);
        const fullBoard= await client.db("creatures").collection("JeopargayData").insertOne(currentBoard);
        
        console.log(fullBoard);
    }
}

async function checkTally(client){
    const tallyResult = await client.db("creatures").collection("JeopargayData").findOne({id: "Tally"});

    if(tallyResult){
        console.log(`Found tallies`);
        console.log(tallyResult);
    }
    else {
        console.log(`No tallies found, new tally created`);
        const zeroTally = await client.db("creatures").collection("JeopargayData").insertOne(currentTally);
        
        console.log(zeroTally);
    }
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

async function checkAnswers(client){
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

const app = express();

app.use(express.static('public'))

app.get('/board', (req, res) =>{

    res.json(currentBoard);
})

app.get('/question', (req, res) =>{

    res.json(currentQuestion);
})

app.get('/tally', (req, res) =>{

    res.json(currentTally);
})

app.post('/updatetally', (req, res) =>{
    const {name, message } = req.body;

    console.log('Database message: ', name, message)
    res.json({message: `The database got some shit`})
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
const express = require('express');
const { MongoClient } = require('mongodb');
var ComfyJS = require("comfy.js");
const ComfyDB = require("comfydb");
var dns = require('dns');
const uri = "mongodb://moose:U3Z1Ldsm5ujamvPd@ac-qpcghfw-shard-00-00.6mmwsv5.mongodb.net:27017,ac-qpcghfw-shard-00-01.6mmwsv5.mongodb.net:27017,ac-qpcghfw-shard-00-02.6mmwsv5.mongodb.net:27017/?ssl=true&replicaSet=atlas-vtp5k5-shard-0&authSource=admin&appName=BlairCluster";
const currentCorrectAnswer = "L";
const currentQuestion = { 
    question: "To be or Not To Be...", 
    answers: [
        {"A": "Weather is it nobler in the mind"},
        {"B": "Whether tis nobler in the mind"},
        {"C": "Sling my fucking arrows goblin"},
        {"D": "Not just arrows but slings and arrows"},
    ]};
const currentAnswers = [];

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

    const client = new MongoClient(uri);
 
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

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function checkTally(client){
    const tallyResult = await client.db("creatures").collection("JeopargayData").findOne({id: "Tally"});

    if(tallyResult){
        console.log(`Found tallies`);
        console.log(tallyResult);
    }
    else {
        console.log(`No tallies found, new tally created`);
        const zeroTally = await client.db("creatures").collection("JeopargayData").insertOne(
            { id: "Tally",
             jester: 0,
             dragon: 0,
             vampire: 0,
             gargoyle: 0,
             warlock: 0,
             thrall: 0,
             lycan: 0,
             mortals: 0 }
        );
        
        console.log(zeroTally);
    }
}

async function retrieveQuestion(client, category){
    const questionsResult = await client.db("creatures").collection("JeopargayData").findOne({_category: category, _active: true});
    
    if(questionsResult)
    {
        console.log(`Got a question! ${category}`);
        console.log(questionsResult);

        // Randomly pick one of the active questions
    }
    else{
        console.log(`No questions found or none are active`);
        // If none are active anymore refresh all
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

app.get('/message', (req, res) =>{
    res.json({message: "We got a message from the backend"});
})

app.post('/message', (req, res) =>{
    const {name, message } = req.body;

    console.log('Database message: ', name, message)
    res.json({message: `The database got some shit`})
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
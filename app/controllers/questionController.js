const QuestionBucket = require("../models/QuestionBucket.model");
const Chatter = require("../models/Chatter.model");
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
        let questionQuery = JSON.parse(req.body);
        console.log(`Request body ${JSON.stringify(questionQuery)}}`);

        const filter = { 
            '_category' : questionQuery._category,
            '_difficulty'  : questionQuery._difficulty
        };
        console.log(filter);

        const possibleCount = QuestionBucket.where(filter).countDocuments();

        // Random entry
        var random = Math.floor(Math.random() * possibleCount);
        let newQuestion = await QuestionBucket.findOne(filter).skip(random);
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

exports.timer_end = async(req, res, next) =>{
    try{
        console.log(`Timer end called, check answers`);
        socket.emit('answer_end', false);
        
        await checkAnswers(currentAnswers);
    }
    catch(err){
        console.log('Error setting timer :: ', err);
    }
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

exports.create_chatters = async(req, res, next) =>{
    try{
        console.log('Get:', 'New Chatter Data');
        let chatterBody = JSON.parse(req.body);
        console.log(chatterBody);

        const chatterArray = [];

        const chatterCount = chatterBody.length;
        for(let i = 0; i < chatterCount; i++){
            console.log(chatterBody[i]);
            var creature = chatterBody[i].Creature;

            if(creature && i){
                 let newchatter = {
                    _userid : i,
                    _clan : "_" + creature.toLowerCase(),
                 };

                 if(chatterBody[i].twitchuser){
                    var twitch_username = chatterBody[i].twitchuser;
                    newchatter._username = twitch_username;
                }
                else if(chatterBody[i].discorduser){
                    var discord_username = chatterBody[i].discorduser;
                    newchatter._username = discord_username;
                }

                var possibleId = parseInt(chatterBody[i]['Discord ID']);
                if(possibleId)
                {
                    newchatter._discordid = possibleId;
                }
                else{
                    newchatter._discordid = i;
                }

                chatterArray.push(newchatter);
            }
        }
        
        console.log(chatterArray);

        let addedChatter = await Chatter.create(chatterArray);
        console.log('Got:', 'New Chatter Data');
        console.log(addedChatter);

        return res.status(200).json({ 
            status: 'success'
        });
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

async function checkAnswers(currentAnswers){
    // Get current list of creatures
    const currentCreatures = await Chatter.find();                

    // Get current baseValue based on difficulty
    const difficulty = foundQuestionData._difficulty;
    difficulty++;
    
    const possibleWinnings = baseValue * difficulty;

    // Update missing chatters from received answers
    const newCreatures = [];

    const creature_usernames = currentCreatures.map(thiscreature => thiscreature._username);
    const users_withoutids = currentCreatures.filter(newcreature => (currentAnswers.includes(newcreature._username) && !currentAnswers.includes(newcreature._userid)));
    const correct_users = currentCreatures.filter(newcreature => (currentAnswers.includes(newcreature._username) && currentAnswers.includes(newcreature._userid)));

    var answerCount = users_withoutids.length;
    for(var i; i < answerCount; i++){        
        var possibleId = currentAnswers.find(creature => creature._username === users_withoutids[i]._username)._userid;
        var thisClan = users_withoutids.find(creature => creature._username === users_withoutids[i]._username);
        const chatterData = {
            _userid : possibleId,
            _username : users_withoutids[i]._username,
        };

        if(thisClan){
            chatterData._clan = thisClan;
        }
        else{
            chatterData._clan = "_mortals";
        }

        newCreatures.push(chatterData);
    }
    
    const fixed_creatures = newCreatures.concat(correct_users);

    if(newCreatures.length > 0){
        await Chatter.create(newCreatures);
    }

    await calculateCurrentTally(fixed_creatures, currentAnswers);
}

async function calculateCurrentTally(updateCreatures, currentAnswers){    
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

    const creatureCount = updateCreatures.length;
    for(let i = 0; i < creatureCount; i++)
    {
        const foundUser = currentAnswers.find((userid) => _userid == updateCreatures[i]._username);

        if(foundUser)
        {
            const thisClan = updateCreatures[i].clan;     
            if(updateCreatures[i]._answer === foundQuestionData._correctanswer){
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
        if(key != "_id")
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
    let tallyResult = await Tally.updateOne({ _tallyid : "tally" }, {$inc: req.body});                

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
const QuestionBucket = require("../models/QuestionBucket.model");
const Tally = require("../models/Tally.model");
const Chatter = require("../models/Chatter.model");
const path = require("path");
const mongoose = require('mongoose');
const jeopargayuri = process.env.JEOPARGAYURI;
const baseValue = 100;

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
        let answerdata = JSON.parse(req.body);
        console.log(`Timer end called, check answers`);
        console.log(`${req.body}`);

        await checkAnswers(answerdata);
        return res.status(200).json({ 
            status: 'success'
        });
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
        console.log('Get:', `${req.body}`);
        let chatterBody = req.body;

        const chatterArray = [];

        const chatterCount = chatterBody.length;
        for(let i = 0; i < chatterCount; i++){
            console.log(chatterBody[i]);
            var creature = chatterBody[i].Creature;

            if(creature){
                 let newchatter = {
                    _userid : i + Math.random(),
                    _clan : "_" + creature.toLowerCase(),
                 };

                 if(chatterBody[i].twitchuser){
                    var twitch_username = chatterBody[i].twitchuser.toLowerCase();
                    newchatter._username = twitch_username;
                }
                else if(chatterBody[i].discorduser){
                    var discord_username = chatterBody[i].discorduser.toLowerCase();
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

async function checkAnswers(answerdata){
    // Get current list of creatures
    const currentCreatures = await Chatter.find();
    const currentAnswers = answerdata._currentanswers;

    console.log(`current answer json :: ${JSON.stringify(answerdata)} :: ${JSON.stringify(currentAnswers)}`);
    console.log(`current answer count :: ${currentAnswers.length}`);
    console.log(`current total creature count :: ${currentCreatures.length}`);

    // Update missing chatters from received answers
    const newCreatures = [];

    const users_withoutids = currentCreatures.filter(newcreature =>
    {
        var answer = currentAnswers.find(useranswer => (
            useranswer._username === newcreature._username.toLowerCase() && 
            useranswer._userid != newcreature._userid));
        return answer;
    });

    console.log(`usernames no ids :: ${JSON.stringify(users_withoutids)}`);
    //console.log(`creatures :: ${JSON.stringify(currentCreatures)}`);

    const correct_users = [];
    for(let c = 0; c < currentAnswers.length; c++)
    {
        currentCreatures.some(thiscreature => {
            if(thiscreature._userid === parseInt(currentAnswers[c]._userid))
            {
                correct_users.push(thiscreature);
            }
        });
    }

    for(let c = 0; c < currentAnswers.length; c++)
    {
        const answer_id = parseInt(currentAnswers[c]._userid);
        const found = users_withoutids.some(noid => noid._userid === answer_id);
        const correct = correct_users.some(creature => creature._userid === answer_id);
        console.log(`answer user id :: ${answer_id}`);
        if(!found && !correct){
            // users_withoutids.push({
            //     _userid : answer_id,
            //     _username : currentAnswers[c]._username,
            //     _clan : "_mortals"
            // });
            const duplicate = currentCreatures.some(thiscreature => thiscreature._username === currentAnswers[c]._username && thiscreature._userid === answer_id);

            if(!duplicate)
            {
                var newcreature = new Chatter({
                    _userid : answer_id,
                    _username : currentAnswers[c]._username,
                    _clan : "_mortals",
                    _discordid : answer_id
                });

                await newcreature.save();
            }
        }
    }
  
    // const correct_users = currentCreatures.filter((oldcreature) => 
    //     currentAnswers.find((answer_data) => oldcreature._userid === parseInt(answer_data._userid)));
    console.log(`Correct users :: ${JSON.stringify(correct_users)}`);
    console.log(`Correct user Count :: ${correct_users.length}`);

    var id_less_Count = users_withoutids.length;
    console.log(`usernames no ids count :: ${id_less_Count}`);

    for(let i = 0; i < id_less_Count; i++){        
        var possibleUser = currentAnswers.find(creature => creature._username === users_withoutids[i]._username.toLowerCase() 
        && creature._userid === users_withoutids[i]._userid);

        if(possibleUser)
        {
            var possibleId = parseInt(possibleUser._userid);
            console.log(`Possible Id :: ${possibleId}`);
            var thisClan = users_withoutids[i]._clan;
            console.log(`Possible Clan :: ${thisClan}`);
            const chatterData = {
                _userid : possibleId,
                _username : users_withoutids[i]._username,
                _discordid : users_withoutids[i]._discordid
            };

            if(thisClan){
                chatterData._clan = thisClan;
            }
            else{
                chatterData._clan = "_mortals";
            }
            
            await Chatter.findOneAndReplace({ _userid : users_withoutids[i]._userid }, chatterData, { upsert: true });

            newCreatures.push(chatterData);
        }
        else{
            console.log(`Missing user :: ${users_withoutids[i]._username.toLowerCase()}`);
        }
    }

    //await Chatter.updateMany({}, { $set: newCreatures }, { updatePipeline : true });
    const fixed_creatures = newCreatures.concat(correct_users);
    console.log(`All creatures :: ${JSON.stringify(fixed_creatures)}`);
    console.log(`All creatures Count :: ${fixed_creatures.length}`);

    await calculateCurrentTally(fixed_creatures, answerdata);
}

async function calculateCurrentTally(updateCreatures, answerdata){    
    // Set base tally
    let currentTally = {
        _jester: 0,
        _dragon: 0,
        _vampire: 0,
        _gargoyle: 0,
        _warlock: 0,
        _thrall: 0,
        _lycan: 0,
        _mortals: 0 
    };

    let participateTally = {
        _jester: 0,
        _dragon: 0,
        _vampire: 0,
        _gargoyle: 0,
        _warlock: 0,
        _thrall: 0,
        _lycan: 0,
        _mortals: 0 
    };

    const selectedanswer = answerdata._selectedanswer;

    // Get current baseValue based on difficulty
    const difficulty = parseInt(answerdata._difficulty) + 1;
    console.log(`Difficulty ${difficulty}`);
    const possibleWinnings = baseValue * difficulty;
    console.log(`Possible winnings :: ${possibleWinnings}`);

    const currentAnswers = answerdata._currentanswers;
    const creatureCount = currentAnswers.length;
    for(let i = 0; i < creatureCount; i++)
    {
        const foundUser = updateCreatures.find((creature) => parseInt(currentAnswers[i]._userid) === creature._userid);
        console.log(`Found creature :: ${JSON.stringify(foundUser)} :: ${currentAnswers[i]._userid}`);

        if(foundUser)
        {
            const thisClan = foundUser._clan;
            console.log(`Found clan :: ${thisClan}`);
            console.log(`Clan type:: ${typeof thisClan}`);

            console.log(`Answer comparisons :: ${currentAnswers[i]._answer} :: ${answerdata._correctanswer}`);
            console.log(`Answer types :: ${typeof currentAnswers[i]._answer} :: ${typeof answerdata._correctanswer}`);
            if(currentAnswers[i]._answer === answerdata._correctanswer){
                currentTally[thisClan]++;
            }
            else currentTally[thisClan]--;

            participateTally[thisClan]++;
            console.log(`This total :: ${currentTally[thisClan]}`);
            console.log(`Participant total :: ${participateTally[thisClan]}`);
        }
    }

    if(selectedanswer)
    {
        if(selectedanswer === answerdata._correctanswer){
            currentTally._vampire++;
        }
        else currentTally._vampire--;
    }

    // var clanCount = 0;
    // var totalTally = 0;
    // for(var key in participateTally){
    //     totalTally += participateTally[key];
    // }
    
    // for(var key in currentTally){
    //     if(key != "_id")
    //     {
    //         if(currentTally[key] != 0)
    //         {
    //             clanCount++;
    //         }
    //     }
    // }

    // console.log(`Totals :: ${totalTally} :: ${clanCount}`);

    for(var key in currentTally){
        if(key != "_id")
        {
            if(currentTally[key] != 0)
            {
                var weightedTally = currentTally[key] / participateTally[key];
                console.log(`Weight :: ${weightedTally}`);
                var newTally = possibleWinnings * weightedTally;

                currentTally[key] = newTally;
            }
        }
    }

    console.log(`Current Tally ${JSON.stringify(currentTally)}`);
    await updateTallies(currentTally);
}

async function updateTallies(newTally){   
    let tallyResult = await Tally.updateOne({ _tallyid : "tally" }, {$inc: newTally});                

    if(tallyResult){
        console.log(`Found tallies`);
        console.log(tallyResult);
    }
    else{
        console.log(`Unabled to retrieve tallies`);
    }
}
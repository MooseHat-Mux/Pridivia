const Tally = require("../models/Tally.model");
const path = require("path");

exports.tally_page = async(req, res, next) =>{
    console.log('Get:', 'Tally Page');
    
    var indexPath = path.join(__dirname, '../../public/views/tally.html');
    res.sendFile(indexPath);
}

exports.tally_check = async(req, res, next) =>{
    try{
        console.log('Get:', 'Tally Data');
        let currentTally = await Tally.findOne({ _tallyid : "tally" });                
        console.log('Got:', 'Tally Data');
        console.log(currentTally);

        return res.status(200).json({ 
            status: 'success', 
            data : { currentTally }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.tally_update = async(req,res, next) =>{
        try{
        console.log('Tally Request Body ::', req.body);
        console.log('Get:', 'Tally Data');
        let currentTally = await Tally.updateOne({ _tallyid : "tally" }, {$inc: req.body});                
        console.log('Got:', 'Tally Data');
        console.log(currentTally);

        return res.status(200).json({ 
            status: 'success', 
            data : { currentTally }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}

exports.tally_createnew = async(req,res, next) =>{
        try{
        console.log('Tally Request Body ::', req.body);
        console.log('Get:', 'Tally Data');

        await Tally.updateOne({_tallyid: 'oldtally'});

        // const newTally = new Tally({
        //     _id: 0,
        //     _tallyid: "tally",
        //     _jester: 0,
        //     _dragon: 0,
        //     _vampire: 0,
        //     _gargoyle: 0,
        //     _warlock: 0,
        //     _thrall: 0,
        //     _lycan: 0,
        //     _mortals: 0          
        // });

        let currentTally = await Tally.create({
            _id: 0,
            _tallyid: "tally",
            _jester: 0,
            _dragon: 0,
            _vampire: 0,
            _gargoyle: 0,
            _warlock: 0,
            _thrall: 0,
            _lycan: 0,
            _mortals: 0          
        });                
        console.log('Got:', 'Tally Data');
        console.log(currentTally);

        return res.status(200).json({ 
            status: 'success', 
            data : { currentTally }});
    }
    catch(err){
        console.log('Error sending json :: ', err);
        res.status(500).send('json not found');
    }
}
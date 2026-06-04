const Tally = require("../models/Tally.model");

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
const mongoose = require('mongoose');
require('dotenv').config();
const creatureuri = process.env.CREATURESURI;
const jeopargayuri = process.env.JEOPARGAYURI;
const uri = process.env.MAINURI;

// // Jeopargay connection 
// // Creature connection 

async function connectMongoose() {
    var options = { dbName : jeopargayuri };

    await mongoose.connect(uri, options);

    // Add connection error handlers
    mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
    });
}

try {
    connectMongoose();
} catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
}

async function connectCreatures(){
    try{
        mongoose.connection.useDb('creatures');
    } catch(err){
        console.log('Error switching to creatures ::', err);
    }
}

async function connectJeopargay(){
    try{
        mongoose.connection.useDb('jeopargay');
    } catch(err){
        console.log('Error switching to jeopargay ::', err);
    }
}
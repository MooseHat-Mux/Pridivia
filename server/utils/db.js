require('dotenv').config()
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose")

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGOMOOSEURI);
    }catch(error){
        console.log(error.message)
    }
}
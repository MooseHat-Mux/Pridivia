const express = require("express");

const app = express();

app.get('/api/twitch', (req,res) => {
    res.json({idk: "I don't know", whatever: "Do whatever"})
})

const port = 8000;

app.listen(port, () => {
    console.log("Server started on port ${port}")
})
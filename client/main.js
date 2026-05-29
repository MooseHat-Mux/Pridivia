var ComfyJS = require("comfy.js");
const ComfyDB = require("comfydb");

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if(command === "test"){
        console.log("Wow you hit a thing!!");
    }
}
ComfyJS.Init("Blair");
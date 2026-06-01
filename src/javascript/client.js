const boardElement = document.getElementById("trivia-board");
const questionElement = document.getElementById("trivia-container");
const tallyElement = document.getElementById("trivia-tally");
var cat1Buttons = document.getElementsByClassName("cat1square");
var buttonCount = cat1Buttons.length;
var cat2Buttons = document.getElementsByClassName("cat2square");
var cat3Buttons = document.getElementsByClassName("cat3square");
var cat4Buttons = document.getElementsByClassName("cat4square");
var cat5Buttons = document.getElementsByClassName("cat5square");
var cat6Buttons = document.getElementsByClassName("cat6square");

const serverUrl = "localhost:3000/server.js";

const answersSchema = {
    q1 : true,
    q2 : true,
    q3 : true,
    q4 : true,
    q5 : true
};

const boardSchema = {
    _boardId : "",
    cat1 : answersSchema,
    cat2 : answersSchema,
    cat3 : answersSchema,
    cat4 : answersSchema,
    cat5 : answersSchema,
    cat6 : answersSchema
};

const currentQuestion = {
    active : true,
    question: "Who has the most terrific balls, cock ass and pussy?",
    answers: [
        { text: "Me", correct: true},
        { text: "You? ha", correct: false},
        { text: "Them? Pfft", correct: false},
        { text: "Certainly him? Uh", currect: false}
    ]
};

const currentTally = [
    { jester: 0 },
    { dragon: 0 },
    { vampire: 0 },
    { gargoyle: 0 },
    { warlock: 0},
    { thrall: 0},
    { lycan: 0},
    { mortals: 0}
];

window.addEventListener("load", (event) =>{
    console.log(window.location.href);

    if(window.location.href.match('index.html')){
        initializeBoard();
    }
    else if(window.location.href.match('question.html')){
        startJeopargay();
    }
    else{
        showTally();
    }
});

function initializeButtons(){

    // Get board grid then disable non-active buttons
    console.log(`Initializing 6 x ${buttonCount}`)

    for(let i = 0; i < buttonCount; i++){
        cat1Buttons[i].addEventListener('click', () =>{
            setUpButton(0, i);
        });
    }

    for(let i = 0; i < buttonCount; i++){
        cat2Buttons[i].addEventListener('click', () =>{
            setUpButton(1, i);
        });
    }  

    for(let i = 0; i < buttonCount; i++){
        cat3Buttons[i].addEventListener('click', () =>{
            setUpButton(2, i);
        });
    }    
    
    for(let i = 0; i < buttonCount; i++){
        cat4Buttons[i].addEventListener('click', () =>{
            setUpButton(3, i);
        });
    }    
    
    for(let i = 0; i < buttonCount; i++){
        cat5Buttons[i].addEventListener('click', () =>{
            setUpButton(4, i);
        });
    }    
    
    for(let i = 0; i < buttonCount; i++){
        sessionStorage.setItem('difficulty' + i, i);

        cat6Buttons[i].addEventListener('click', () =>{
            setUpButton(5, i);
        });
    }
}

function setUpButton(cat, diff){   
    console.log(`Setting category ${cat} at difficulty ${diff}`);
    sessionStorage.setItem('category', cat);
    sessionStorage.setItem('difficulty', diff);
}

function initializeBoard(){
    try{
        const response = fetch(url);

    }
    catch(err){

    }
}

function showTally(){
    // Call mongoDB for current tally data
    // If document is unavailable create it with each of the clans set to 0

}

function startJeopargay(){
    // Start Timer
    // Retrieve Question
    showQuestion();
}

function showQuestion(){
    // Call question passing category and difficulty
    // Gets back a random question from available questions in bucket
    // Updates database with active buttons

    let currentCatDiff = JSON.parse(sessionStorage.getItem('currentCatDiff'));
    console.log(currentCatDiff);

    let category = sessionStorage.getItem('category');
    let difficulty =  sessionStorage.getItem('difficulty');

    console.log(`Cat ${category} at difficulty ${difficulty} Question called`);
}

function calculateCurrentTally(){
    
}

initializeButtons();
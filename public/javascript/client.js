const boardElement = document.getElementById("trivia-board");
const questionElement = document.getElementById("trivia-container");
const tallyElement = document.getElementById("trivia-tally");

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
    //console.log(window.location.href);

    if(window.location.href.match('./public/views/question.html')){
        startJeopargay();
    }
    else{
        showTally();
    }
});

function showTally(){
    // Call mongoDB for current tally data
    // If document is unavailable create it with each of the clans set to 0

    console.log('Show tally called');
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
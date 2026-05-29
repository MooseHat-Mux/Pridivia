const boardElement = document.getElementById("trivia-board");
const questionElement = document.getElementById("trivia-container");
const tallyElement = document.getElementById("trivia-tally");
const endButton = document.getElementById("end-button");
const resetButton = document.getElementById("reset-button");
const tallyButton = document.getElementById("tally-button");
const boardButton = document.getElementById("board-button");

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

endButton.addEventListener("click", ()=>{
    initializeBoard();
});

tallyButton.addEventListener("click", ()=>{
    showTally();
});

resetButton.addEventListener("click", ()=>{
    // Refresh board so all tiles have fresh questions
    // If all questions have been asked refresh the bucked of questions and update the database
});

boardButton.addEventListener("click", ()=>{
    initializeBoard();
});

function initializeBoard(){


}

function showTally(){
    // Call mongoDB for current tally data
    // If document is unavailable create it with each of the clans set to 0

}

function startJeopargay(){

    // Retrieve random active question from mongodb
    showQuestion();

    // Set question to inactive effectively removing it from selection
}

function showQuestion(){
    
}

function calculateCurrentTally(){
    
}
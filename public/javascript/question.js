//const streamuri = process.env.HERGRACE;
var currentAnswers = [];
let selectedAnswer = '';
let correctAnswer = '';
let foundQuestionData = {};
const timeDone = false;
const dailydouble = false;
const baseValue = 100;
const socket = io();
let countdownInterval;
var timerElement = document.getElementById("timer-display");
var questionElement = document.getElementById("question-display");
var pauseElement = document.getElementById("pause-button");
var answers = document.getElementsByClassName("option");
const answer_results = {};

document.addEventListener("DOMContentLoaded", function(){
    startJeopargay();
});

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});

socket.on('chatanswers', (data) => {
    currentAnswers = data;
});


async function InitializeAnswers(){
    console.log(`Answers initialized`);
    for(const option in answers){
        option.addEventListener('click', () =>{
            selectedAnswer = answers[option].innerHTML;
        });
    }
}

async function startJeopargay(){
    // Call question passing category and difficulty
    // Gets back a random question from available questions in bucket
    let category = sessionStorage.getItem('category');
    let difficulty =  sessionStorage.getItem('difficulty');

    console.log(`Cat ${category} at difficulty ${difficulty} Question called`);
    const requestBody = {
        _category: category,
        _difficulty: difficulty
    };
    console.log(`Question body request ${JSON.stringify(requestBody)}`);

    try{
        console.log('Initializing Question');
        const options = {
            method: "POST",
            body: JSON.stringify(requestBody)
        }

        await fetch('/board/questiondisplay', options)
        .then(questiondisplay => {
            console.log('Question Initialized');
            return questiondisplay.json();
        }).then(data => {
            console.log('Data retrieved');
            foundQuestionData = data.data.newQuestion;
            console.log(foundQuestionData);

            questionElement.innerHTML = foundQuestionData._question;
            correctAnswer = foundQuestionData._correctAnswer;
            console.log(`Store correct answer::`, correctAnswer);

            var _answers = [];
            for(var answer in foundQuestionData._answers)
            {
                _answers.push(foundQuestionData._answers[answer]);
            }

            let index = 0;
            for(let option of answers){
                option.innerHTML = _answers[index];
                answer_results[_answers[index]] = option;
                option.addEventListener('click', () =>{
                    selectedAnswer = _answers[index];
                });

                console.log(`Option ${index}: ${_answers[index]}`)
                index++;
            }

            console.log(`Options found ${index}`)
            //InitializeAnswers();
        }).catch(err => console.log(err));  
        
        // Updates database with active buttons
        await fetch('/board/updateboard', options);
        // if (!response.ok) {
        //     throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)
        // }

        console.log('Initialized Question');
        
        StartTimer();
    }
    catch(err){
        console.log('Error initializing Question ::', err);
    }
}

function showAnswer(){
    // Highlight correct answer

    console.log(`Correct answer ::`, correctAnswer);
    for(let option of answers){
        option.disabled = true;

        console.log(`This answer ${option.innerHTML}`);
        if(option.innerHTML === correctAnswer){
            option.classList.add('correct');
        }
        else{
            option.classList.add('incorrect');
        }
    }
}

async function StartTimer(){
    console.log('Timer started!');
    clearInterval(countdownInterval);
    let remainingTime = 30;

    timerElement.innerHTML = `Time Remaining : ${remainingTime}`;

    try{
        console.log('Initializing Start Timer Data');

        socket.emit('timer_start', true)
    }catch(err){
        console.log('Error setting timer ::', err);
    }

    countdownInterval = setInterval(() =>{
        remainingTime--;

        if(remainingTime >= 0)
        {
            timerElement.innerHTML = `Time Remaining : ${remainingTime}`;
        }
        else{
            clearInterval(countdownInterval);
            timerElement.innerHTML = 'Womp Womp';
            try{
                console.log('Initializing End Timer Data');
                const options = {
                    method: "POST",
                    body: JSON.stringify(currentAnswers)
                }

                fetch('/board/timerend', options);
                socket.emit('answer_end', false);
            }catch(err){
                 console.log('Error setting timer ::', err);
            }

            showAnswer();
        }
    }, 1000);
}
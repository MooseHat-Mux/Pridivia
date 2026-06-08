const streamuri = process.env.HERGRACE;
var currentAnswers = [];
const selectedAnswer = '';
const foundQuestionData = {};
const timeDone = false;
const dailydouble = false;
const baseValue = 100;
const socket = io();

document.addEventListener("DOMContentLoaded", function(){
    var timerElement = document.getElementById("timer-display");
    var questionElement = document.getElementById("question-display");
    var answers = document.getElementsByClassName('option');
    let countdownInterval;
    const answer_results = {};

    async function InitializeAnswers(){
        console.log(`Answers initialized`);
        for(var option in answers){
            answers[option].addEventListener(() =>{
                selectedAnswer = answers[option].innerHTML;
            });
        }
    }

    async function startJeopargay(){
        // Retrieve Question    
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

                var _answers = [];
                for(var answer in foundQuestionData._answers)
                {
                    _answers.push(foundQuestionData._answers[answer]);
                }

                let index = 0;
                for(var option in answers){
                    answers[option].innerHTML = _answers[index];
                    answer_results[_answers[index]] = answers[option];
                    console.log(`Option ${index}: ${_answers[index]}`)
                    index++;
                }

                console.log(`Options found ${index}`)
                InitializeAnswers();
            }).catch(err => console.log(err));  

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
        // Call question passing category and difficulty
        // Gets back a random question from available questions in bucket
        // Updates database with active buttons

        for(var option in answers){
            answers[option].disabled = true;
        }

        // Highlight correct answer
        for(var option in answers){
            if(answers[option].innerHTML === foundQuestionData._correct_answer){
                
            }
        }
    }

    function StartTimer(){
        console.log('Timer started!');
        clearInterval(countdownInterval);
        let remainingTime = 30;

        timerElement.innerHTML = `Time Remaining : ${remainingTime}`;

        try{
            console.log('Initializing Start Timer Data');
            const requestBody = {
                timeStart: true
            };
            const options = {
                method: "POST",
                body: JSON.stringify(requestBody)
            }

            await fetch('/board/timer', options);
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
                    const requestBody = {
                        timeStart: false
                    };
                    const options = {
                        method: "POST",
                        body: JSON.stringify(requestBody)
                    }

                    await fetch('/board/timer', options);
                }catch(err){
                    console.log('Error setting timer ::', err);
                }

                showAnswer();
            }
        }, 1000);
    }

    startJeopargay();
});

socket.on('chatanswers', (data) => {
    currentAnswers = data;
});
document.addEventListener("DOMContentLoaded", function(){
    var timerElement = document.getElementById("timer-display");
    var questionElement = document.getElementById('question');
    var answers = document.getElementsByClassName('option');
    let countdownInterval;

    async function startJeopargay(){
        // Retrieve Question    
        let currentCatDiff = JSON.parse(sessionStorage.getItem('currentCatDiff'));
        console.log(currentCatDiff);

        let category = sessionStorage.getItem('category');
        let difficulty =  sessionStorage.getItem('difficulty');

        console.log(`Cat ${category} at difficulty ${difficulty} Question called`);

        try{
            console.log('Initializing Question');

            await fetch('/board/questionbucket', {
                method: "POST",
                body: {_category : category, _difficulty : difficulty}
            }).then(questionbucket => {
                return questionbucket.json();
            }).then(data => {
                console.log('Data retrieved');
                console.log(data);
            }).catch(err => console.log(err));
            
            console.log('Question Initialized');
            
            showQuestion();
        }
        catch(err){
            console.log('Error initializing Question ::', err);
        }
    }

    function showQuestion(){
        // Call question passing category and difficulty
        // Gets back a random question from available questions in bucket
        // Updates database with active buttons
        
        // Start Timer
        StartTimer();
    }

    function StartTimer(){
        console.log('Timer started!');
        clearInterval(countdownInterval);
        let remainingTime = 30;

        timerElement.innerHTML = `Time Remaining : ${remainingTime}`;

        countdownInterval = setInterval(() =>{
            remainingTime--;

            if(remainingTime >= 0)
            {
                timerElement.innerHTML = `Time Remaining : ${remainingTime}`;
            }
            else{
                clearInterval(countdownInterval);
                timerElement.innerHTML = 'Womp Womp';
            }
        }, 1000);
    }
});
var cat1Buttons = document.getElementsByClassName("cat1square");
var buttonCount = cat1Buttons.length;
var cat2Buttons = document.getElementsByClassName("cat2square");
var cat3Buttons = document.getElementsByClassName("cat3square");
var cat4Buttons = document.getElementsByClassName("cat4square");
var cat5Buttons = document.getElementsByClassName("cat5square");
var cat6Buttons = document.getElementsByClassName("cat6square");
var resetButton = document.getElementById("reset-button");
const serverUrl = "/board";

resetButton.addEventListener('click', ()=>{
    try{
        console.log('Resetting Board');

        fetch('/board/resetboard').then(board => {
            return board.json();
        }).then(data => {
            console.log('Data retrieved');
            console.log(data);
            initializeButtons(data.data);
        }).catch(err => console.log(err));
        
        console.log('Board Reset');
    }
    catch(err){
        console.log('Error resetting board ::', err);
    }
});

async function initializeBoard(){
    try{
        console.log('Initializing Board');

        await fetch('/board/currentboard').then(board => {
            return board.json();
        }).then(data => {
            console.log('Data retrieved');
            console.log(data);
            initializeButtons(data.data);
        }).catch(err => console.log(err));
        
        console.log('Board Initialized');
    }
    catch(err){
        console.log('Error initializing board ::', err);
    }
}

function setUpButton(cat, diff){   
    console.log(`Setting category ${cat} at difficulty ${diff}`);
    sessionStorage.setItem('category', cat);
    sessionStorage.setItem('difficulty', diff);
    window.location.href = "/board/question";
}

function initializeButtons(data){
    var currentBoard = data.currentBoard;
    console.log(currentBoard);
    // Get board grid then disable non-active buttons
    console.log(`Initializing 6 x ${buttonCount}`)

    for(var boardKey in currentBoard){
        //console.log(`${boardKey}`);
        if(boardKey === "_cat1")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat1Buttons[index].disabled = false;
                        cat1Buttons[index].classList.remove('inactive');
                        cat1Buttons[index].addEventListener('click', () =>{
                            setUpButton(0, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat1Buttons[index].disabled = true;
                        cat1Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
        else if(boardKey === "_cat2")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat2Buttons[index].disabled = false;
                        cat2Buttons[index].classList.remove('inactive');
                        cat2Buttons[index].addEventListener('click', () =>{
                            setUpButton(1, index);
                        });
                        //console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat2Buttons[index].disabled = true;
                        cat2Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
        else if(boardKey === "_cat3")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat3Buttons[index].disabled = false;
                        cat3Buttons[index].classList.remove('inactive');
                        cat3Buttons[index].addEventListener('click', () =>{
                            setUpButton(2, index);
                        });
                        //console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat3Buttons[index].disabled = true;
                        cat3Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
        else if(boardKey === "_cat4")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat4Buttons[index].disabled = false;
                        cat4Buttons[index].classList.remove('inactive');
                        cat4Buttons[index].addEventListener('click', () =>{
                            setUpButton(3, index);
                        });
                        //console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat4Buttons[index].disabled = true;
                        cat4Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
        else if(boardKey === "_cat5")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat5Buttons[index].disabled = false;
                        cat5Buttons[index].classList.remove('inactive');
                        cat5Buttons[index].addEventListener('click', () =>{
                            setUpButton(4, index);
                        });
                        //console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat5Buttons[index].disabled = true;
                        cat5Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
        else if(boardKey === "_cat6")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                let index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat6Buttons[index].disabled = false;
                        cat6Buttons[index].classList.remove('inactive');
                        cat6Buttons[index].addEventListener('click', () =>{
                            setUpButton(5, index);
                        });
                        //console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat6Buttons[index].disabled = true;
                        cat6Buttons[index].classList.add('inactive');
                    }
                }
            }
        }
    }
}

initializeBoard();
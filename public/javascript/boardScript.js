var cat1Buttons = document.getElementsByClassName("cat1square");
var buttonCount = cat1Buttons.length;
var cat2Buttons = document.getElementsByClassName("cat2square");
var cat3Buttons = document.getElementsByClassName("cat3square");
var cat4Buttons = document.getElementsByClassName("cat4square");
var cat5Buttons = document.getElementsByClassName("cat5square");
var cat6Buttons = document.getElementsByClassName("cat6square");
const serverUrl = "/board";

initializeBoard();

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
}

function initializeButtons(data){
    var currentBoard = data.currentBoard;
    console.log(currentBoard);
    // Get board grid then disable non-active buttons
    console.log(`Initializing 6 x ${buttonCount}`)

    for(var boardKey in currentBoard){
        console.log(`${boardKey}`);
        if(boardKey === "_cat1")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat1Buttons[index].addEventListener('click', () =>{
                            setUpButton(0, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat1Buttons[index].disabled = true;
                    }
                }
            }
        }
        else if(boardKey === "_cat2")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat2Buttons[index].addEventListener('click', () =>{
                            setUpButton(1, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat2Buttons[index].disabled = true;
                    }
                }
            }
        }
        else if(boardKey === "_cat3")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat3Buttons[index].addEventListener('click', () =>{
                            setUpButton(2, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat3Buttons[index].disabled = true;
                    }
                }
            }
        }
        else if(boardKey === "_cat4")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat4Buttons[index].addEventListener('click', () =>{
                            setUpButton(3, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat4Buttons[index].disabled = true;
                    }
                }
            }
        }
        else if(boardKey === "_cat5")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat5Buttons[index].addEventListener('click', () =>{
                            setUpButton(4, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat5Buttons[index].disabled = true;
                    }
                }
            }
        }
        else if(boardKey === "_cat6")
        {
            for(var questionKey in currentBoard[boardKey])
            {
                var index = parseInt(questionKey.replace('q', '')) - 1; // Replace all leading non-digits with nothing
                if (index > -1){
                    if(currentBoard[boardKey][questionKey])
                    {
                        cat6Buttons[index].addEventListener('click', () =>{
                            setUpButton(5, index);
                        });
                        console.log(`${boardKey} : ${questionKey} => ${index}`);
                    }
                    else{
                        cat6Buttons[index].disabled = true;
                    }
                }
            }
        }
    }
}

    // for(let i = 0; i < buttonCount; i++){
    //     cat1Buttons[i].addEventListener('click', () =>{
    //         setUpButton(0, i);
    //     });
    // }

    // for(let i = 0; i < buttonCount; i++){
    //     cat2Buttons[i].addEventListener('click', () =>{
    //         setUpButton(1, i);
    //     });
    // }  

    // for(let i = 0; i < buttonCount; i++){
    //     cat3Buttons[i].addEventListener('click', () =>{
    //         setUpButton(2, i);
    //     });
    // }    
    
    // for(let i = 0; i < buttonCount; i++){
    //     cat4Buttons[i].addEventListener('click', () =>{
    //         setUpButton(3, i);
    //     });
    // }    
    
    // for(let i = 0; i < buttonCount; i++){
    //     cat5Buttons[i].addEventListener('click', () =>{
    //         setUpButton(4, i);
    //     });
    // }    
    
    // for(let i = 0; i < buttonCount; i++){
    //     sessionStorage.setItem('difficulty' + i, i);

    //     cat6Buttons[i].addEventListener('click', () =>{
    //         setUpButton(5, i);
    //     });
    // }
// }


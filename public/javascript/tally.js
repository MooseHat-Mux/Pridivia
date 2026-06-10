const tallyElement = document.getElementById("trivia-tally");
const jester_progress = document.getElementById("jester");
const dragon_progress = document.getElementById("dragon");
const vampire_progress = document.getElementById("vampire");
const warlock_progress = document.getElementById("warlock");
const gargoyle_progress = document.getElementById("gargoyle");
const thrall_progress = document.getElementById("thrall");
const lycan_progress = document.getElementById("lycan");
const mortals_progress = document.getElementById("mortals");

const currentTally = {};
const creatureCount = 8;
const currentMax = 200;
const maxTiers = [
    300,
    400,
    500,
    1000,
    1500,
    2500,
    3500
];

document.addEventListener("DOMContentLoaded", function(){
    showTally();
});

function showTally(){
    // Call mongoDB for current tally data
    // If document is unavailable create it with each of the clans set to 0

    console.log('Show tally called');

    try{
        await fetch('/board/tally/check', options)
        .then(tallydisplay => {
            console.log('Question Initialized');
            return tallydisplay.json();
        }).then(data => {
            console.log('Data retrieved');
            currentTally = data.data.currentTally;
            console.log(currentTally);

            for(var i = 0; i < maxTiers.length; i++)
            {
                for(var creature in currentTally){
                    if(creature != "id"){
                        if(currentTally[creature] >= maxTiers[i])
                        {
                            currentMax = maxTier[i];
                            return;
                        }
                    }
                }
            }
            
            for(var creature in currentTally){
                if(creature != "id"){
                    if(currentTally[creature] < 0)
                    {
                        currentTally[creature] = 0;
                    }
                }
            }

            jester_progress.style.height = currentTally["jester"] / currentMax + '%';
            dragon_progress.style.height = currentTally["dragon"] / currentMax + '%';
            vampire_progress.style.height = currentTally["vampire"] / currentMax + '%';
            warlock_progress.style.height = currentTally["warlock"] / currentMax + '%';
            gargoyle_progress.style.height = currentTally["gargoyle"] / currentMax + '%';
            thrall_progress.style.height = currentTally["thrall"] / currentMax + '%';
            lycan_progress.style.height = currentTally["lycan"] / currentMax + '%';
            mortals_progress.style.height = currentTally["mortals"] / currentMax + '%';
        });
    }
    catch(err){
        console.log(`Error showing Tally:: `, err);
    }
}
const tallyElement = document.getElementById("trivia-tally");
const jester_progress = document.getElementById("jester");
const dragon_progress = document.getElementById("dragon");
const vampire_progress = document.getElementById("vampire");
const warlock_progress = document.getElementById("warlock");
const gargoyle_progress = document.getElementById("gargoyle");
const thrall_progress = document.getElementById("thrall");
const lycan_progress = document.getElementById("lycan");
const mortals_progress = document.getElementById("mortals");

const jester_total = document.getElementById("jester-total");
const dragon_total = document.getElementById("dragon-total");
const vampire_total = document.getElementById("vampire-total");
const warlock_total = document.getElementById("warlock-total");
const gargoyle_total = document.getElementById("gargoyle-total");
const thrall_total = document.getElementById("thrall-total");
const lycan_total = document.getElementById("lycan-total");
const mortals_total = document.getElementById("mortals-total");

const creatureCount = 8;
var currentMax = 200;
const maxTiers = [
    300,
    400,
    500,
    1000,
    1500,
    2500,
    3500,
    5000,
    7500,
    10000,
    20000
];

document.addEventListener("DOMContentLoaded", function(){
    showTally();
});

async function showTally(){
    // Call mongoDB for current tally data
    // If document is unavailable create it with each of the clans set to 0

    console.log('Show tally called');

    try{
        await fetch('/board/tally/check')
        .then(tallydisplay => {
            console.log('Question Initialized');
            return tallydisplay.json();
        }).then(data => {
            console.log('Data retrieved');
            var currentTally = data.data.currentTally;
            console.log(currentTally);

            for(var i = 0; i < maxTiers.length; i++)
            {
                for(var creature in currentTally){
                    if(creature != "id"){
                        if(currentTally[creature] >= maxTiers[i])
                        {
                            currentMax = maxTiers[i];
                        }
                    }
                }
            }
            
            // for(var creature in currentTally){
            //     if(creature != "id"){
            //         if(currentTally[creature] < 0)
            //         {
            //             currentTally[creature] = 0;
            //         }
            //     }
            // }

            console.log(`Current Max :: ${currentMax}`);

            jester_total.innerHTML = `${currentTally._jester}`;
            dragon_total.innerHTML = currentTally["_dragon"].toFixed(2);
            vampire_total.innerHTML = currentTally["_vampire"].toFixed(2);
            warlock_total.innerHTML = currentTally["_warlock"].toFixed(2);
            gargoyle_total.innerHTML = currentTally["_gargoyle"].toFixed(2);
            thrall_total.innerHTML = currentTally["_thrall"].toFixed(2);
            lycan_total.innerHTML = currentTally["_lycan"].toFixed(2);
            mortals_total.innerHTML = currentTally["_mortals"].toFixed(2);

            jester_progress.style.height = currentTally["_jester"] / currentMax * 100 + '%';
            dragon_progress.style.height = currentTally["_dragon"] / currentMax * 100 + '%';
            vampire_progress.style.height = currentTally["_vampire"] / currentMax * 100 + '%';
            warlock_progress.style.height = currentTally["_warlock"] / currentMax * 100 + '%';
            gargoyle_progress.style.height = currentTally["_gargoyle"] / currentMax * 100 + '%';
            thrall_progress.style.height = currentTally["_thrall"] / currentMax * 100 + '%';
            lycan_progress.style.height = currentTally["_lycan"] / currentMax * 100 + '%';
            mortals_progress.style.height = currentTally["_mortals"] / currentMax * 100 + '%';
        });
    }
    catch(err){
        console.log(`Error showing Tally:: `, err);
    }
}
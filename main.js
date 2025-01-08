/*
let colors = {
    color: [
        {"100 Mph": "c93f38"},
        {"18th Century Green": "a59344"},
        ....
*/

// Get all color objects from the colors object
const colorObjects = colors.color;


// bal oldalt mindig fekete a betu szine,
// jobb oldalt egy random szin nev és betuhatternek 50/50 bal oldalt levo szinnev
// IGAZ / HAMIS

// create a centered div > 2 divs inside > left and right > left is black, right is random color name and background color is 50% chance left color and 50% chance random color
// event for left and right button > upon left button push > user thinks its the same color > if true add 1 point
// upon right button push > user thinks its not the same color > if tru add 1 point
// countdown timer > 30 sec > if time runs out > game over > show score


let score = 0;
let time = 30;
let timer;
let gameIsRunning = false;


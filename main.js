let allColors = [];

const difficultySelect = document.getElementById("difficulty");

const storedDifficulty = localStorage.getItem("difficulty") || "colors_expert.json";
difficultySelect.value = storedDifficulty;

function loadColors() {
    const selectedDifficulty = difficultySelect.value;
    localStorage.setItem("difficulty", selectedDifficulty);
    return fetch(selectedDifficulty)
        .then(response => response.json())
        .then(data => {
            allColors = data;
        });
}

difficultySelect.addEventListener("change", (event) => {
    loadColors().then(() => {
        if (started) {
            resetGame();
        }
    });
});

let started = false;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let totalGuesses = 0;

const colorCss = document.getElementById("color_card-text");
const meaningCss = document.getElementById("meaning_card-text");
const startButton = document.getElementById("startBtn");
const stopButton = document.getElementById("stopBtn");
const scoreText = document.getElementById("score");
const arrowsNo = document.querySelector(".arrows-no");
const arrowsYes = document.querySelector(".arrows-yes");
const timer = document.getElementById("timer");
const cover = document.querySelector(".cover");

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        stopGame();
        return;
    }
    if (event.key === "ArrowLeft") {
        handleMatch(false);
    } else if (event.key === "ArrowRight") {
        handleMatch(true);
    }
});
startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);

arrowsNo.addEventListener("click", () => handleMatch(false));
arrowsYes.addEventListener("click", () => handleMatch(true));

function startGame() {
    started = true;
    cover.style.display = "none";

    loadColors().then(() => {
        resetGame();
        startRoundTimer();
    });
}

function stopGame() {
    started = false;
    document.getElementById("endscore").style.display = "block";
    document.getElementById("endscore").textContent = "Score: " + score;
    resetGame();
    clearInterval(countdown);
    cover.style.display = "flex"
    score = 0;
    displayFinalStats();
}

function handleMatch(isMatch) {
    checkMatch(isMatch);
}

function checkMatch(isMatch) {
    totalGuesses++;
    const matched = compColor();
    if (matched === isMatch) {
        score++;
        correctCount++;
    } else {
        incorrectCount++;
    }
    resetGame();
    scoreText.textContent = score;
}


function compColor() {
    return colorCss.dataset.colorName.toLowerCase() === colorCss.dataset.textName.toLowerCase();
}

function getRandomColorItem() {
    if (allColors.length < 1) return { name: "placeholder", hex: "#000000" };
    return allColors[Math.floor(Math.random() * allColors.length)];
}


function generateColor() {
    const colorItem = getRandomColorItem();
    let textItem;

    if (Math.random() < 0.5) {
        // 50% chance to have a matching color
        textItem = colorItem;
    } else {
        // Ensure textItem is a different color
        do {
            textItem = getRandomColorItem();
        } while (textItem.name.toLowerCase() === colorItem.name.toLowerCase());
    }

    const fakeItem = getRandomColorItem();
    return {
        colorHex: colorItem.hex,
        colorName: colorItem.name,
        textName: textItem.name,
        fakeName: fakeItem.name
    };
}

function startRoundTimer() {
    countdown = setInterval(function() {

        if(!started) {
            clearInterval(countdown);
            return;
        }

        var now = new Date().getTime();
        var distance = countDownDate - now;
        var seconds = ((distance % (1000 * 60)) / 1000).toFixed(1);
        document.getElementById("timer").textContent = seconds + "s";
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById("timer").textContent = "time is up!";
            stopGame();
        }
    }, 100);
}

function getHexByName(name) {
    const colorItem = allColors.find(color => color.name.toLowerCase() === name.toLowerCase());
    return colorItem ? colorItem.hex : "#000000";
}

function resetGame() {
    const { colorHex, colorName, textName, fakeName } = generateColor();
    colorCss.textContent = textName;
    
    const textColorHex = getHexByName(textName);
    colorCss.style.color = textColorHex;
    
    colorCss.parentNode.style.backgroundColor = invertColor(textColorHex);
    
    colorCss.dataset.colorName = colorName;
    colorCss.dataset.textName = textName;
    
    meaningCss.textContent = fakeName;
    countDownDate = new Date().getTime() + 10000;
    scoreText.textContent = score;
}

function displayFinalStats() {
    const endElement = document.getElementById("endscore");
    const ratio = (correctCount / totalGuesses * 100).toFixed(1) + "%";
    endElement.innerHTML = "Score: " + score
        + " | Correct: " + correctCount
        + " | Incorrect: " + incorrectCount
        + " | Ratio: " + ratio;
    correctCount = 0;
    incorrectCount = 0;
    totalGuesses = 0;
}

function invertColor(hex) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const invertedR = (255 - r).toString(16).padStart(2, "0");
    const invertedG = (255 - g).toString(16).padStart(2, "0");
    const invertedB = (255 - b).toString(16).padStart(2, "0");
    return "#" + invertedR + invertedG + invertedB;
}


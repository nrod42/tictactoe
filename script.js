//Make a new div at bottom that says whos turn it is

const cells = document.querySelectorAll('.cell');
const cellsArray = Array.from(cells);
const gameScreen = document.querySelector('.gameScreen');
const newGameBtns = document.querySelectorAll('.newGameBtn');
const playBtn = document.querySelector('.playBtn');
const resultScreen = document.querySelector('.resultScreen');
const winnerDisplay = document.querySelector('.winnerDisplay');
const player1Score = document.querySelector('.player1Score');
const player2Score = document.querySelector('.player2Score');
const playAgainBtn = document.querySelector('.playAgainBtn');
const gameBoard = document.querySelector('.gameBoard');
const newGameForm = document.getElementById('newGameForm');
const winningCond = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]
];

let player1;
let player2;
let currentPlayer;
let currentBoard = [];
let turn = 0;

newGameForm.addEventListener('submit', showGame)

newGameBtns.forEach(button => {
    button.addEventListener('click', newGame);
});

cells.forEach(cell => {
    cell.textContent = "";
    cell.addEventListener('click', makeMove);
})

playAgainBtn.addEventListener('click', playAgain);

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    let score = 0;
    const addScore = (x) => {
        score += x;
    };
    const getScore = () => score;
    return {getName, getMark, getScore, addScore}
};

function showGame (e) {
    e.preventDefault();
    gameBoard.style.display = 'grid'
    newGameForm.style.display = 'none'
    player1 = Player(newGameForm.player1.value, 'X');
    player2 = Player(newGameForm.player2.value, 'O');
    currentPlayer = player1;
    clickEnable();
}

function makeMove(e) {
    if (!e.target.classList.contains('clickEnabled')) return; //checks if clickEnabled class is active. If its not (which occurs when game is over and on result screen), then adding a mark is "disabled"
    if (e.target.textContent != "") return; //prevents cells fromb being marked twice
    e.target.textContent = currentPlayer.getMark();
    currentBoard = cellsArray.map(cell => cell.textContent); //updates the current board array every turn
    turn++;
    checkTie();
    showWinner();
    switchPlayer();
}

function switchPlayer() {
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1;
}

function showWinner () {
    if (checkWin() == true) {
        clickDisable();
        winner(currentPlayer);
    };
}

function checkWin () {
    for (let i = 0; i <= winningCond.length - 1; i++) {
        let winCond = winningCond[i];
        let a = currentBoard[winCond[0]];
        let b = currentBoard[winCond[1]];
        let c = currentBoard[winCond[2]];
        if (a == "" || b == "" || c == "") continue;
        if (a == b && b == c) {
            return true;
        }
    }
}

function winner (winner) {
    resultScreen.style.display = 'flex';
    gameScreen.style.filter = 'blur(2px)';
    winnerDisplay.textContent  = winner.getName() + ' wins!';
    winner == player1 ? player1.addScore(1) : player2.addScore(1);
    player1Score.textContent = player1.getName() + ': ' + player1.getScore();
    player2Score.textContent = player2.getName() + ': ' + player2.getScore();
}

function checkTie () {
    if (turn >= 9) {
        resultScreen.style.display = 'flex';
        gameScreen.style.filter = 'blur(2px)';
        winnerDisplay.textContent  = 'It\'s a tie!';
    } 
}

function clickEnable () {
    cells.forEach(cell => {
        cell.classList.add('clickEnabled');
    });
}

function clickDisable () {
    cells.forEach(cell => {
        cell.classList.remove('clickEnabled');
    });
}

function newGame () {
    currentPlayer = player1;
    cells.forEach(cell => {
        cell.textContent = "";
        clickEnable(); //Re-adds the class which allows a mark to be placed again since its a new game
    });
    gameBoard.style.display = 'none';
    newGameForm.style.display = 'flex';
    newGameForm.player1.value = "";
    newGameForm.player2.value = "";
    resultScreen.style.display = 'none';
    gameScreen.style.filter = 'blur(0)';
    turn = 0;
}

function playAgain () {
    resultScreen.style.display = 'none';
    cells.forEach(cell => {
        cell.textContent = "";
        clickEnable();//Re-adds the class which allows a mark to be placed again since its a new game
    });
    gameScreen.style.filter = 'blur(0)';
    turn = 0;
}
const cells = document.querySelectorAll('.cell');
const cellsArray = Array.from(cells);
const gameScreen = document.querySelector('.gameScreen');
const scoreBoard = document.querySelector('.scoreBoard');
const scoreBoardPlayer1 = document.querySelector('.scoreBoardPlayer1');
const scoreBoardPlayer2 = document.querySelector('.scoreBoardPlayer2');
const playerTurn = document.querySelector('.playerTurn');
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

const Player = (name, mark, color) => {
    const getName = () => name;
    const getMark = () => mark;
    const getColor = () => color;
    let score = 0;
    const addScore = (x) => {
        score += x;
    };
    const getScore = () => score;
    return {getName, getMark, getColor, getScore, addScore}
};

const gameController = (() => {

    let player1;
    let player2;
    let currentPlayer;
    let currentBoard = [];
    let turn = 0;

    const showGame = (e)  => {
        e.preventDefault();
        newGameForm.style.display = 'none';
        gameBoard.style.display = 'grid';
        playerTurn.style.display = 'flex';
        player1 = Player(newGameForm.player1.value, 'X', 'blue');
        player2 = Player(newGameForm.player2.value, 'O', 'red');
        currentPlayer = player1;
        playerTurn.textContent = 'It\'s ' + currentPlayer.getName() + '\'s turn';
        clickEnable();
    }

    const makeMove = (e) => {
        if (!e.target.classList.contains('clickEnabled')) return; //checks if clickEnabled class is active. If its not (which occurs when game is over and on result screen), then adding a mark is "disabled"
        if (e.target.textContent != "") return; //prevents cells fromb being marked twice
        e.target.textContent = currentPlayer.getMark();
        e.target.style.color = currentPlayer.getColor();
        currentBoard = cellsArray.map(cell => cell.textContent); //updates the current board array every turn
        turn++;
        checkTie();
        showWinner();
        switchPlayer();
        playerTurn.textContent = 'It\'s ' + currentPlayer.getName() + '\'s turn';
    }

    const switchPlayer = () => {
        currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1;
    }

    const showWinner = () => {
        if (checkWin() == true) {
            clickDisable();
            winner(currentPlayer);
        };
    }

    const checkWin  = () => {
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

    const winner  = (winner) => {
        resultScreen.style.display = 'flex';
        gameScreen.style.filter = 'blur(2px)';
        winnerDisplay.textContent  = winner.getName() + ' wins!';
        winner == player1 ? player1.addScore(1) : player2.addScore(1);
        player1Score.textContent = player1.getName() + ': ' + player1.getScore();
        player2Score.textContent = player2.getName() + ': ' + player2.getScore();
    }

    const checkTie = () => {
        if (turn >= 9) {
            resultScreen.style.display = 'flex';
            gameScreen.style.filter = 'blur(2px)';
            winnerDisplay.textContent  = 'It\'s a tie!';
        } 
    }

    const clickEnable = () => {
        cells.forEach(cell => {
            cell.classList.add('clickEnabled');
        });
    }

    const clickDisable = () => {
        cells.forEach(cell => {
            cell.classList.remove('clickEnabled');
        });
    }

    const newGame = () => {
        currentPlayer = player1;
        cells.forEach(cell => {
            cell.textContent = "";
            clickEnable(); //Re-adds the class which allows a mark to be placed again since its a new game
        });
        gameBoard.style.display = 'none';
        scoreBoard.style.display = 'none';
        newGameForm.style.display = 'flex';
        newGameForm.player1.value = "";
        newGameForm.player2.value = "";
        playerTurn.style.display = 'none';
        resultScreen.style.display = 'none';
        gameScreen.style.filter = 'blur(0)';
        
        turn = 0;
    }

    const playAgain = () => {
        resultScreen.style.display = 'none';
        cells.forEach(cell => {
            cell.textContent = "";
            clickEnable();//Re-adds the class which allows a mark to be placed again since its a new game
        });
        gameScreen.style.filter = 'blur(0)';
        turn = 0;
        scoreBoard.style.display = 'grid';
        scoreBoardPlayer1.textContent = player1.getName() + ': ' + player1.getScore();
        scoreBoardPlayer1.style.color = player1.getColor();
        scoreBoardPlayer2.textContent = player2.getName() + ': ' + player2.getScore();
        scoreBoardPlayer2.style.color = player2.getColor();
    }

    return {showGame, makeMove, showWinner, newGame, playAgain};
})();

newGameForm.addEventListener('submit', gameController.showGame)

newGameBtns.forEach(button => {
    button.addEventListener('click', gameController.newGame);
});

cells.forEach(cell => {
    cell.textContent = "";
    cell.addEventListener('click', gameController.makeMove);
})

playAgainBtn.addEventListener('click', gameController.playAgain);
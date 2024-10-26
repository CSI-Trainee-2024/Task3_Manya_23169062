const boardSize = 10;
const totalMines = 3;
let board = [];
let mines = [];
let revealedCells = 0;
const bestScoreElement = document.getElementById('best');
const scoreElement = document.getElementById('score');
const gameOverModal = document.getElementById('gameOverModal');
const victoryModal = document.getElementById('victoryModal');
const finalScoreElement = document.getElementById('finalScore');
const finalScoreVictoryElement = document.getElementById('finalScoreVictory');
let currentScore = 0;
let bestScore = 0; 

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            document.getElementById('board').appendChild(cell);
            board[i][j] = {
                element: cell,
                hasMine: false,
                revealed: false,
                neighborMines: 0,
                flagged: false
            };
        }
    }
}
        
function placeMines() {
    let minesPlaced = 0;
     while (minesPlaced < totalMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].hasMine) {
            board[row][col].hasMine = true;
            mines.push({ row, col });
            minesPlaced++;
        }
    }
}
        
function countNeighborMines(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j].hasMine) {
                if (i !== row || j !== col) {
                    count++;
                }
            }
        }
    }
    return count;
}
       
function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.revealed || cell.flagged) {
        return;
    }
    cell.revealed = true;
    revealedCells++;
    cell.element.classList.remove('hidden');
    if (cell.hasMine) {
        cell.element.classList.add('bomb');
        // Game over
        setTimeout(function() {
            gameOver();
        }, 2000);
    } else {
        const neighborMines = countNeighborMines(row, col);
        if (neighborMines === 0) {
            cell.element.classList.add('check');
            cell.element.textContent = '';
        } else {
            cell.element.textContent = neighborMines;
            cell.element.classList.add('check');
        }
        currentScore++;
        scoreElement.textContent = 'Score: ' + currentScore;
        if (revealedCells === (boardSize * boardSize) - totalMines) {
            setTimeout(function() {
                victory();
            }, 500);
        }
    }
}
        
function handleClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];
    if (cell.hasMine) {
        cell.element.classList.add('bomb');
        // Game over
        setTimeout(function() {
            gameOver();
        }, 2000);
    } else {
        revealCell(row, col);
    }
}
        
function handleRightClick(event) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];
    if (!cell.revealed) {
        cell.flagged = !cell.flagged;
        event.target.classList.toggle('marked');
    }
}
        
function gameOver() {
    finalScoreElement.textContent = currentScore;
    gameOverModal.style.display = 'block';
    
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.addEventListener('click', function() {
        gameOverModal.style.display = 'none';
    });
    
    if (currentScore > bestScore) {
        bestScore = currentScore;
        bestScoreElement.textContent = 'Best Score: ' + bestScore;
    }
    resetGame();
}

function victory() {
    finalScoreVictoryElement.textContent = currentScore;
    victoryModal.style.display = 'block';
    const closeButton = document.getElementsByClassName('close')[1];
    closeButton.addEventListener('click', function() {
        victoryModal.style.display = 'none';
    });
    if (currentScore > bestScore) {
        bestScore = currentScore;
        bestScoreElement.textContent = 'Best Score: ' + bestScore;
    }
    resetGame();
}

function resetGame() {
    board = [];
    mines = [];
    revealedCells = 0;
    currentScore = 0;
    scoreElement.textContent = 'Score: ' + currentScore;
    const boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    createBoard();
    placeMines();
}
document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    placeMines();
});
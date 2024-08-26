const socket = io();

const gameBoard = document.getElementById('game-board');
const currentPlayerDisplay = document.getElementById('current-player');
const selectedCharacterDisplay = document.getElementById('selected-character');
const moveOptionsDisplay = document.getElementById('move-options');
const moveHistoryDisplay = document.getElementById('move-history');

let currentPlayer = null;
let selectedCharacter = null;
let playerNumber = null;
let gameId = null;

socket.emit('joinGame');

socket.on('gameJoined', (data) => {
    gameId = data.gameId;
    playerNumber = data.playerNumber;
    console.log(`Joined game ${gameId} as player ${playerNumber}`);
});

socket.on('gameStart', (data) => {
    currentPlayer = data.currentPlayer;
    updateBoard(data.board);
    updateCurrentPlayerDisplay();
});

socket.on('gameUpdate', (data) => {
    currentPlayer = data.currentPlayer;
    updateBoard(data.board);
    updateCurrentPlayerDisplay();
    addMoveToHistory(data.lastMove);
});

socket.on('invalidMove', (message) => {
    alert(message);
});

function updateBoard(board) {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (board[i][j]) {
                cell.textContent = board[i][j];
                cell.classList.add(`player-${board[i][j][0]}`);
            }
            cell.addEventListener('click', selectCharacter);
            gameBoard.appendChild(cell);
        }
    }
}

function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer === socket.id ? 'You' : 'Opponent'}`;
    currentPlayerDisplay.style.color = currentPlayer === socket.id ? '#ff9999' : '#99ff99';
}

function selectCharacter(event) {
    const cell = event.target;
    const character = cell.textContent;
    if (character && character.startsWith(playerNumber === 1 ? 'A' : 'B') && currentPlayer === socket.id) {
        if (selectedCharacter) {
            document.querySelector('.selected')?.classList.remove('selected');
        }
        selectedCharacter = character;
        cell.classList.add('selected');
        selectedCharacterDisplay.textContent = `Selected: ${character}`;
        showMoveOptions(character);
    }
}

function showMoveOptions(character) {
    moveOptionsDisplay.innerHTML = '';
    let moves;
    if (character.includes('P')) {
        moves = ['L', 'R', 'F', 'B'];
    } else if (character.includes('H1')) {
        moves = ['L', 'R', 'F', 'B'];
    } else if (character.includes('H2')) {
        moves = ['FL', 'FR', 'BL', 'BR'];
    }
    moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move;
        button.addEventListener('click', () => makeMove(move));
        moveOptionsDisplay.appendChild(button);
    });
}

function makeMove(move) {
    if (currentPlayer === socket.id) {
        socket.emit('makeMove', { gameId, character: selectedCharacter, move });
    }
}

function addMoveToHistory(move) {
    if (move) {
        const moveEntry = document.createElement('div');
        moveEntry.textContent = `${move.player}: ${move.character} moved ${move.direction}`;
        moveHistoryDisplay.insertBefore(moveEntry, moveHistoryDisplay.firstChild);
    }
}
const ws = new WebSocket('ws://localhost:8081');

ws.onopen = () => {
    console.log('Connected to the server');
    const initMessage = JSON.stringify({
        type: 'init',
        player: 'A',
        team: ['A-P1', 'A-H1', 'A-P2', 'A-H2', 'A-P3']
    });
    ws.send(initMessage);
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        renderBoard(data.gameState.board);
    }
};

function renderBoard(board) {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board
    board.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell) {
                const [player] = cell.split('-');
                cellElement.classList.add(`player-${player}`);
                cellElement.textContent = cell;
            }
            boardElement.appendChild(cellElement);
        });
    });
}

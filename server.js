// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const games = new Map();

class Game {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.currentPlayer = 0;
        this.board = [
            ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3']
        ];
    }

    addPlayer(playerId) {
        if (this.players.length < 2) {
            this.players.push(playerId);
            return true;
        }
        return false;
    }

    makeMove(player, character, move) {
        if (player !== this.players[this.currentPlayer]) {
            return { valid: false, message: 'Not your turn' };
        }

        // Implement move logic here
        // This is a simplified version and doesn't include all game rules
        const [row, col] = this.findCharacter(character);
        if (row === -1) {
            return { valid: false, message: 'Character not found' };
        }

        let newRow = row, newCol = col;
        switch (move) {
            case 'L': newCol--; break;
            case 'R': newCol++; break;
            case 'F': newRow--; break;
            case 'B': newRow++; break;
            case 'FL': newRow--; newCol--; break;
            case 'FR': newRow--; newCol++; break;
            case 'BL': newRow++; newCol--; break;
            case 'BR': newRow++; newCol++; break;
        }

        if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) {
            return { valid: false, message: 'Invalid move' };
        }

        this.board[newRow][newCol] = this.board[row][col];
        this.board[row][col] = '';

        this.currentPlayer = 1 - this.currentPlayer;
        return { valid: true, board: this.board };
    }

    findCharacter(character) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] === character) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGame', () => {
        let game;
        for (const [id, g] of games) {
            if (g.players.length < 2) {
                game = g;
                break;
            }
        }

        if (!game) {
            const gameId = Math.random().toString(36).substr(2, 9);
            game = new Game(gameId);
            games.set(gameId, game);
        }

        if (game.addPlayer(socket.id)) {
            socket.join(game.id);
            socket.emit('gameJoined', { gameId: game.id, playerId: socket.id, playerNumber: game.players.length });

            if (game.players.length === 2) {
                io.to(game.id).emit('gameStart', { board: game.board, currentPlayer: game.players[game.currentPlayer] });
            }
        } else {
            socket.emit('gameFull');
        }
    });

    socket.on('makeMove', ({ gameId, character, move }) => {
        const game = games.get(gameId);
        if (game) {
            const result = game.makeMove(socket.id, character, move);
            if (result.valid) {
                io.to(gameId).emit('gameUpdate', { board: result.board, currentPlayer: game.players[game.currentPlayer] });
            } else {
                socket.emit('invalidMove', result.message);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Handle player disconnection (e.g., end the game, notify other player)
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
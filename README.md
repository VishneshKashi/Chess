
Hello! Vishnesh here.
This project is a simple chess-like game implemented using Node.js, Express, and Socket.IO for real-time multiplayer gameplay.

## Project Structure

chess-like-game/
│
├── server.js
├── package.json
├── public/
│   ├── index.html
│   └── client.js
└── README.md

## Setup Instructions

1. Clone the repository or download the project files.

2. Navigate to the project directory in your terminal:
   cd chess-like-game

3. Install the required dependencies:
   npm install

4. Create a `package.json` file if it doesn't exist:
   npm init -y

5. Install the necessary packages:
   npm install express socket.io

## Running the Server

1. Start the server by running:
   node server.js

2. You should see a message saying "Server running on port 3000" (or whichever port you've configured).

## Accessing the Client

1. Open a web browser and navigate to `http://localhost:3000` (or whichever port your server is running on).

2. You should see the game board and be able to play the game.

## Playing the Game

1. Open the game in two different browser windows or tabs to simulate two players.

2. The game will start when two players have joined.

3. Players take turns moving their pieces:
   - Click on a piece to select it.
   - Click on one of the available move buttons to make a move.

4. The game board updates in real-time for both players.

5. The move history is displayed below the game board.

## Customization

- You can modify the game rules or board layout by editing the `Game` class in `server.js`.
- To change the appearance of the game, edit the CSS in `public/index.html`.
- To modify client-side game logic, edit `public/client.js`.

## Troubleshooting

- If you encounter a "port already in use" error, change the port number in `server.js`.
- Make sure all files are in the correct directories as specified in the project structure.
- Check the browser console and server console for any error messages.

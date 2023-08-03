// server.js
const WebSocket = require('websocket').server;
const http = require('http');

const server = http.createServer((req, res) => {
  // You can ignore this for WebSocket
});

const wsServer = new WebSocket({
  httpServer: server,
  autoAcceptConnections: false,
});

const connections = [];

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  connections.push(connection);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      if (data.type === 'answer') {
        // Handle user's answer, calculate score, and send score updates back to clients
        const isCorrect = questions.find((q) => q.id === data.questionId)?.correctAnswer === data.answer;
        if (isCorrect) {
          // Increment the score for the user who answered correctly
          score += 1;
        }
        // Send updated score to all connected clients
        const scoreUpdate = {
          type: 'scoreUpdate',
          score: score,
        };
        connections.forEach((conn) => conn.sendUTF(JSON.stringify(scoreUpdate)));
      }
    }
  });

  connection.on('close', () => {
    const index = connections.indexOf(connection);
    if (index !== -1) {
      connections.splice(index, 1);
    }
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is listening on port 8080');
});

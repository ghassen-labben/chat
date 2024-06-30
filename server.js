const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
  const id = uuidv4();
  clients.set(ws, id);

  console.log(`New client connected: ${id}`);

  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const metadata = { id, timestamp: new Date().toISOString() };
    const outbound = JSON.stringify({ ...message, ...metadata });

    [...clients.keys()].forEach((client) => {
      if (client !== ws) {
        client.send(outbound);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Client deconecte: ${id}`);
    clients.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
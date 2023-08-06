import express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';
const app = express()
const server = http.createServer(app);

const wss = new WebSocketServer({ server:server });

wss.on('connection', function connection(ws) {
  ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

  });
});

wss.on('close', function close() {
    console.log('disconnected');
});

app.get('/', (_req: any, res: any) => res.send('Hello World!'))

server.listen(8888, () => console.log(`Lisening on port :8888`))

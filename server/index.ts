import express = require('express');
import fs = require('fs');
import https = require('https');
import socketIo = require('socket.io');
import { get } from './model';

const port = process.env.PORT || 3001;
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

const app = express();

const server = https.createServer(options, app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('User is connected');

  let playerId: string | null = null;
  let contextId: string | null = null;

  socket.on('init', data => {
    const session = io.sockets.adapter.rooms[data.contextId];
    if (session && session.length >= 2) {
      console.log('Error - to many people in the room');
      return;
    }

    playerId = data.playerId;
    contextId = data.contextId;

    socket.join(data.contextId);
    const game = get(data.contextId, data.playerId);
    socket.emit('game-loaded', game);
  });

  socket.on('disconnect', () => {
    socket.leave(contextId!);
    console.log('user disconnected');
  });

  socket.on('move', data => {
    socket.to(contextId!).emit('opponent-moved', data);
  });

});

/* tslint:disable:no-console */
server.listen(port, () => console.log(`App is listening on port ${port}!`));

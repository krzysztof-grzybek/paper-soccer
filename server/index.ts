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

const sessions = {};

io.on('connection', socket => {
  console.log('User is connected');

  socket.on('init', data => {
    const game = get(data.contextId, data.playerId);
    socket.emit('game-loaded', game);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('move', () => {
    console.log('user move');
  });

});

/* tslint:disable:no-console */
server.listen(port, () => console.log(`App is listening on port ${port}!`));

import express = require('express');
import fs = require('fs');
import https = require('https');
import socketIo = require('socket.io');
import { create, exists, get, getOpponent, isTurnOwnedBy, update, updateGame } from './model';

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
    const { contextId: ctxId, playerId: pId} = data;
    const session = io.sockets.adapter.rooms[ctxId];
    if (session && session.length >= 2) {
      console.log('Error - to many people in the room');
      return;
    }

    playerId = pId;
    contextId = ctxId;

    socket.join(ctxId);

    let game: any = null;
    if (exists(ctxId)) {
      game = get(ctxId);
      if (!game.player2) {
        update(ctxId, { player2: pId });
      }
    } else {
      game = create(ctxId, pId);
    }

    socket.emit('game-loaded', game);
  });

  socket.on('disconnect', () => {
    socket.leave(contextId!);
  });

  socket.on('move', data => {
    if (!isTurnOwnedBy(contextId!, playerId!)) {
      return;
    }
    const oponent = getOpponent(contextId!, playerId!);
    updateGame(contextId!, { currentTurn: oponent, state: data });
    socket.to(contextId!).emit('opponent-moved', data);
  });

});

/* tslint:disable:no-console */
server.listen(port, () => console.log(`App is listening on port ${port}!`));

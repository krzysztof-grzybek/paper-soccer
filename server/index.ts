import express = require('express');
import fs = require('fs');
import https = require('https');
import socketIo = require('socket.io');
import {create, exists, get, getOpponent, isTurnOwnedBy, setLostMove, setWinMove, update, updateGame} from './model';

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

  socket.on('move', ({ type, history }) => {
    if (!isTurnOwnedBy(contextId!, playerId!)) {
      return;
    }

    if (type === 'progress') {
      const opponent = getOpponent(contextId!, playerId!);
      updateGame(contextId!, { currentTurn: opponent, history });
      socket.to(contextId!).emit('opponent-moved', { type: 'progress', history });
    } else if (type === 'win') {
      setWinMove(contextId!, playerId!, history);
      socket.to(contextId!).emit('opponent-moved', { type: 'loss', history });
    } else if (type === 'loss') {
      setLostMove(contextId!, playerId!, history);
      socket.to(contextId!).emit('opponent-moved', { type: 'win', history });
    }
  });

});

/* tslint:disable:no-console */
server.listen(port, () => console.log(`App is listening on port ${port}!`));

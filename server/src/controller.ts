import { Socket } from 'socket.io';
import {
  challenge,
  create,
  exists,
  get,
  getGameState,
  getOpponent,
  isTurnOwnedBy,
  setLostMove,
  setWinMove,
  update,
  updateGame
} from './model';

function controller(socket: Socket) {
  console.log('User is connected !');

  let playerId: string | null = null;
  let contextId: string | null = null;

  socket.on('init', data => {
    console.log('init action');
    const { contextId: ctxId, playerId: pId} = data;
    const session = socket.adapter.rooms[ctxId];
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
        updateGame(ctxId, { currentTurn: pId });
        game = get(ctxId);
      }
    } else {
      game = create(ctxId, pId);
    }
    console.log('game loaded response ' + ctxId + ' ' + playerId);
    socket.emit('game-loaded', game);
    console.log('opponent connected response ' + ctxId + ' ' + playerId);
    socket.to(contextId!).emit('opponent-connected', playerId);
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

  socket.on('challenge', () => {
    const winner = getGameState(contextId!);

    if (winner !== 'end') {
      console.error('Cannot challenge during the game');
      return;
    }

    challenge(contextId!, playerId!);
    socket.to(contextId!).emit('challenged', { challengedAgainBy: playerId });
  });

  socket.on('start-new-game', callback => {
    const game = create(contextId!, playerId!);
    callback(game);
    socket.to(contextId!).emit('new-game-started', game);
  });

}

export { controller };

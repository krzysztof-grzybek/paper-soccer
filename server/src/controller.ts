import { Socket } from 'socket.io';
import {
  challenge, Context,
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

  let playerId!: string;
  let contextId!: string;

  socket.on('init', (data: { contextId: string, playerId: string }) => {
    console.log('init action');
    const { contextId: ctxId, playerId: pId } = data;
    const session = socket.adapter.rooms[ctxId];
    // TODO: check if it's player from DB
    if (session && session.length >= 2) {
      console.error('Error - to many people in the room');
      return;
    }

    playerId = pId;
    contextId = ctxId;

    socket.join(ctxId);

    let context!: Context;
    if (exists(ctxId)) {
      context = get(ctxId);
      if (!context.player2) {
        update(ctxId, { player2: pId });
        updateGame(ctxId, { currentTurn: pId }); // TODO: fix
        context = get(ctxId);
      }
    } else {
      context = create(ctxId, pId);
    }

    socket.emit('game-loaded', context);
    socket.to(contextId).emit('opponent-connected', playerId);
  });

  socket.on('disconnect', () => {
      socket.leave(contextId);
  });

  socket.on('move', (
    { type, trailState }: { type: 'progress' | 'win' | 'loss', trailState: number[] }
  ) => {
    if (!isTurnOwnedBy(contextId, playerId)) {
      return;
    }

    if (type === 'progress') {
      try {
        const opponent = getOpponent(contextId, playerId); // TODO: fix
        updateGame(contextId, { currentTurn: opponent, trailState });
      } catch {
        updateGame(contextId, { trailState });
      }

    } else if (type === 'win') {
      setWinMove(contextId, playerId, trailState);
    } else if (type === 'loss') {
      setLostMove(contextId, playerId, trailState);
    }

    socket.to(contextId).emit('opponent-moved', { type, trailState });
  });

  socket.on('challenge', () => {
    const gameState = getGameState(contextId);

    if (gameState !== 'end') {
      console.error('Cannot challenge during the game');
      return;
    }

    challenge(contextId, playerId);
    socket.to(contextId).emit('challenged', { challengedAgainBy: playerId });
  });

  socket.on('start-new-game', (callback: (ctx: Context) => void) => {
    const context = create(contextId, playerId);
    callback(context);
    socket.to(contextId).emit('new-game-started', context);
  });

}

export { controller };

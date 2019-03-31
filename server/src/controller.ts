import { Socket } from 'socket.io';
import {
  challenge,
  Context,
  create,
  createGame,
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
  console.log('Session started');

  let playerId!: string;
  let contextId!: string;

  socket.on('init', (data: { contextId: string, playerId: string }) => {
    console.log('Init session');
    const { contextId: ctxId, playerId: pId } = data;
    const session = socket.adapter.rooms[ctxId];

    if (session && session.length >= 2) {
      console.error('Error - to many people in the room.');
      return;
    }

    playerId = pId;
    contextId = ctxId;

    socket.join(contextId);

    let context!: Context;
    if (exists(contextId)) {
      context = get(contextId);
      if (playerId !== context.player1 && !context.player2) {
        update(contextId, { player2: playerId });
        if (context.game.currentTurn === 'unknown-player') {
          updateGame(contextId, { currentTurn: playerId });
        }
        context = get(contextId);
      } else if (
        context.player1 &&
        context.player2 &&
        playerId !== context.player1 &&
        playerId !== context.player2
      ) {
        console.error('Error - only 2 players can play in single context.');
        return;
      }
    } else {
      context = create(contextId, playerId);
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
        const opponent = getOpponent(contextId, playerId);
        updateGame(contextId, { currentTurn: opponent, trailState });
      } catch {
        updateGame(contextId, { trailState, currentTurn: 'unknown-player' });
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
    const context = createGame(contextId, playerId);
    callback(context);
    socket.to(contextId).emit('new-game-started', context);
  });

  socket.on('is-opponent-connected', (callback: (isConnected: boolean) => void) => {
    const session = socket.adapter.rooms[contextId];
    const isOpponentConnected = session && session.length === 2;
    callback(isOpponentConnected);
  });

}

export { controller };

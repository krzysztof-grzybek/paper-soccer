import redis = require('redis');
import config = require('./config');

const redisClient = redis.createClient({ url: config.config.dbUrl });

type player = string;

interface Game {
  initiator: player;
  currentTurn: player | 'unknown-player';
  state: 'progress' | 'end';
  winner: player | null;
  challengedAgainBy: player | null;
  trailState: number[];
}

interface Context {
  contextId: string;
  player1: player;
  player2: player | null;
  initiator: player;
  currentTurn: player | 'unknown-player';
  state: 'progress' | 'end';
  winner: player | null;
  challengedAgainBy: player | null;
  trailState: number[];
}

function createContext(contextId: string, playerId: string): Context {
  console.log('creating context');
  redisClient.set('string key', 'string val', redis.print);
  return {
    contextId,
    player1: playerId,
    player2: null,
    ...(createNewGame(playerId)),
  };
}

function createNewGame(initiatorPlayer: string): Game {
  return {
    initiator: initiatorPlayer,
    currentTurn: initiatorPlayer,
    state: 'progress',
    winner: null,
    challengedAgainBy: null,
    trailState: [],
  };
}

function exists(contextId: string): Promise<boolean> {
  return new Promise(resolve => {
    redisClient.exists(`context:${contextId}`, (err, result) => {
      resolve(result === 1);
    });
  });
}

function get(contextId: string): Promise<Context> {
  return new Promise(resolve => {
    redisClient.hgetall(`context:${contextId}`, (err, result) => {
      const context: any = result;

      for (const key of Object.keys(context)) {
        let value: any;
        value = context[key] === 'null' ? null : context[key];
        value = context[key] === 'false' ? false : value;
        value = context[key] === 'true' ? true : value;
        value = key === 'trailState' ? JSON.parse(context[key]) : value;
        context[key] = value;
      }
      resolve(context as Context);
    });
  });
}

function create(contextId: string, initiatorPlayer: player): Promise<Context> {
  return new Promise(resolve => {
    const context = createContext(contextId, initiatorPlayer);
    if (context.trailState) {
      (context as any).trailState = JSON.stringify(context.trailState);
    }
    redisClient.hmset(`context:${contextId}`, context as any, (err, result) => { // TODO: fix types
      console.log(result);
      resolve(context);
    });
  });
}

function createGame(contextId: string, playerId: player): Promise<Context> {
  const newGame = createNewGame(playerId);
  return updateGame(contextId, newGame);
}

function update(contextId: string, updateData: Partial<Context>): Promise<Context> {
  if (updateData.trailState) {
    (updateData as any).trailState = JSON.stringify(updateData.trailState);
  }

  return new Promise(resolve => {
      redisClient.hmset(`context:${contextId}`, updateData as any, (err, result) => { // TODO: fix types
        get(contextId).then(resolve);
      });
    });
}

function updateGame(contextId: string, updateData: Partial<Game>): Promise<Context> {
  return new Promise(resolve => {
      if (updateData.trailState) {
        (updateData as any).trailState = JSON.stringify(updateData.trailState);
      }

      redisClient.hmset(`context:${contextId}`, updateData as any, (err, result) => { // TODO: fix types
        get(contextId).then(resolve);
      });
    });
}

async function isTurnOwnedBy(contextId: string, playerId: string): Promise<boolean> {
  const game = await get(contextId);
  return game.currentTurn === playerId || game.currentTurn === null;
}

async function getOpponent(ctxId: string, playerId: player): Promise<player> {
  const game = await get(ctxId);
  const opponent = game.player1 === playerId ? game.player2 : game.player1;
  if (opponent === null) {
    throw new Error('Opponent not known');
  }

  return opponent;
}

function setWinMove(contextId: string, playerId: player, trailState: number[]) {
  return updateGame(contextId, { winner: playerId, state: 'end', trailState });
}

async function setLostMove(contextId: string, playerId: player, trailState: number[]) {
  const game = await get(contextId);
  const winner = game.player1 === playerId ? game.player2 : game.player1;
  return updateGame(contextId, { winner, state: 'end', trailState });
}

async function getGameState(contextId: string) {
  const game = await get(contextId);
  return game.state;
}

function challenge(contextId: string, playerId: player) {
  return updateGame(contextId, { challengedAgainBy: playerId });
}

export {
  Context,
  Game,
  challenge,
  create,
  createGame,
  exists,
  get,
  getOpponent,
  getGameState,
  isTurnOwnedBy,
  update,
  updateGame,
  setLostMove,
  setWinMove,
 };

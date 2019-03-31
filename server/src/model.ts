import fs = require('fs');

type player = string;

interface Game {
  initiator: player;
  currentTurn: player | 'unknown-player';
  state: 'progress' | 'end';
  winner: player | null;
  challengedAgainBy: player | null;
  trailState: number[]
}

interface Context {
  contextId: string;
  player1: player;
  player2: player | null;
  game: Game;
}

function createContext(contextId: string, playerId: string): Context {
  return {
    contextId,
    player1: playerId,
    player2: null,
    game: createNewGame(playerId),
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

function exists(contextId: string) {
  const file = fs.readFileSync(__dirname + '/database.json', 'utf8');
  const db = JSON.parse(file);
  return Boolean(db[contextId]);
}

function get(contextId: string): Context {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  return db[contextId];
}

function create(contextId: string, initiatorPlayer: player): Context {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  const context = createContext(contextId, initiatorPlayer);
  db[contextId] = context;
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return context;
}

function createGame(contextId: string, playerId: player): Context {
  const newGame = createNewGame(playerId);
  updateGame(contextId, newGame);
  return get(contextId);
}

function update(contextId: string, updateData: Partial<Context>): Context {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  db[contextId] = { ...db[contextId], ...updateData };
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return db[contextId];
}

function updateGame(contextId: string, updateData: Partial<Game>): Context {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  db[contextId].game = { ...(db[contextId].game), ...updateData };
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return db[contextId];
}

function isTurnOwnedBy(contextId: string, playerId: string) {
  return get(contextId).game.currentTurn === playerId || get(contextId).game.currentTurn === null;
}

function getOpponent(ctxId: string, playerId: player): player {
  const game = get(ctxId);
  const player = game.player1 === playerId ? game.player2 : game.player1;
  if (player === null) {
    throw new Error('Opponent not known');
  }

  return player;
}

function setWinMove(contextId: string, playerId: player, trailState: number[]) {
  updateGame(contextId, { winner: playerId, state: 'end', trailState });
}

function setLostMove(contextId: string, playerId: player, trailState: number[]) {
  const game = get(contextId);
  const winner = game.player1 === playerId ? game.player2 : game.player1;
  updateGame(contextId, { winner, state: 'end', trailState });
}

function getGameState(contextId: string) {
  const game = get(contextId);
  return game.game.state;
}

function challenge(contextId: string, playerId: player) {
  updateGame(contextId, { challengedAgainBy: playerId });
}

export { Context, Game, challenge, create, createGame, exists, get, getOpponent, getGameState, isTurnOwnedBy, update, updateGame, setLostMove, setWinMove };

import fs = require('fs');

type player = string;

interface Game {
  initiator: player;
  currentTurn: player;
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
    game: {
      initiator: playerId,
      currentTurn: playerId,
      state: 'progress',
      winner: null,
      challengedAgainBy: null,
      trailState: [],
    },
  };
}

function exists(contextId: string) {
  const file = fs.readFileSync(__dirname + '/database.json', 'utf8');
  const db = JSON.parse(file);
  return Boolean(db[contextId]);
}

function get(contextId: string) {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  return db[contextId];
}

function create(contextId: string, playerId: string) {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  const game = createContext(contextId, playerId);
  db[contextId] = game;
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return game;
}

function update(contextId: string, updateData: any) {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  db[contextId] = { ...db[contextId], ...updateData };
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return db[contextId];
}

function updateGame(contextId: string, updateData: any) {
  const db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
  db[contextId].game = { ...(db[contextId].game), ...updateData };
  fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
  return db[contextId];
}

function isTurnOwnedBy(contextId: string, playerId: string) {
  return get(contextId).game.currentTurn === playerId || get(contextId).game.currentTurn === null;
}

function getOpponent(ctxId: string, playerId: string) {
  const game = get(ctxId);
  return game.player1 === playerId ? game.player2 : game.player1;
}

function setWinMove(contextId: string, playerId: string, trailState: number[]) {
  updateGame(contextId, { winner: playerId, state: 'end', trailState });
}

function setLostMove(contextId: string, playerId: string, trailState: number[]) {
  const game = get(contextId);
  const winner = game.player1 === playerId ? game.player2 : game.player1;
  updateGame(contextId, { winner, state: 'end', trailState });
}

function getGameState(contextId: string) {
  const game = get(contextId);
  return game.game.state;
}

function challenge(contextId: string, playerId: string) {
  updateGame(contextId, { challengedAgainBy: playerId });
}

export { challenge, create, exists, get, getOpponent, getGameState, isTurnOwnedBy, update, updateGame, setLostMove, setWinMove };

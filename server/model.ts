import fs = require('fs');

function createNewGame(contextId: string, playerId: string) {
  return {
    contextId,
    player1: playerId,
    player2: null,
    lastWinPlayer: null,
    game: {
      initiator: playerId,
      currentTurn: playerId,
      state: 'progress',
      winner: null,
      history: [],
      isFresh: true,
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
  const game = createNewGame(contextId, playerId);
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
  return get(contextId).game.currentTurn === playerId;
}

function getOpponent(ctxId: string, playerId: string) {
  const game = get(ctxId);
  return game.player1 === playerId ? game.player2 : game.player1;
}

function setWinMove(contextId: string, playerId: string, movesHistory: number[]) {
  updateGame(contextId, { winner: playerId, state: 'end', history: movesHistory });
}

function setLostMove(contextId: string, playerId: string, movesHistory: number[]) {
  const game = get(contextId);
  const winner = game.player1 === playerId ? game.player2 : game.player1;
  updateGame(contextId, { winner, state: 'end', history: movesHistory });
}

export { create, exists, get, getOpponent, isTurnOwnedBy, update, updateGame, setLostMove, setWinMove };

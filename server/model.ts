function createNewGame(contextId: string, playerId: string) {
  return {
    contextId,
    player1: playerId,
    player2: null,
    lastWinPlayer: null,
    game: {
      initiator: playerId,
      currentTurn: playerId,
      isFresh: true,
    },
  };
}
const db = {} as any;

function get(contextId: string, playerId: string) {
  return db[contextId] || createNewGame(contextId, playerId);
}

function update(contextId: string, updateData: any) {
  db[contextId] = { ...db[contextId], ... updateData };
  return db[contextId];
}

export { get, update };

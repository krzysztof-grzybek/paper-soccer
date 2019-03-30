"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function createContext(contextId, playerId) {
    return {
        contextId: contextId,
        player1: playerId,
        player2: null,
        game: createGameInstance(playerId),
    };
}
function createGameInstance(playerId) {
    return {
        initiator: playerId,
        currentTurn: playerId,
        state: 'progress',
        winner: null,
        challengedAgainBy: null,
        trailState: [],
    };
}
function exists(contextId) {
    var file = fs.readFileSync(__dirname + '/database.json', 'utf8');
    var db = JSON.parse(file);
    return Boolean(db[contextId]);
}
exports.exists = exists;
function get(contextId) {
    var db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
    return db[contextId];
}
exports.get = get;
function create(contextId, playerId) {
    var db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
    var context = createContext(contextId, playerId);
    db[contextId] = context;
    fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
    return context;
}
exports.create = create;
function createGame(contextId, playerId) {
    var newGame = createGameInstance(playerId);
    updateGame(contextId, newGame);
    return get(contextId);
}
exports.createGame = createGame;
function update(contextId, updateData) {
    var db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
    db[contextId] = __assign({}, db[contextId], updateData);
    fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
    return db[contextId];
}
exports.update = update;
function updateGame(contextId, updateData) {
    var db = JSON.parse(fs.readFileSync(__dirname + '/database.json', 'utf8'));
    db[contextId].game = __assign({}, (db[contextId].game), updateData);
    fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
    return db[contextId];
}
exports.updateGame = updateGame;
function isTurnOwnedBy(contextId, playerId) {
    return get(contextId).game.currentTurn === playerId || get(contextId).game.currentTurn === null;
}
exports.isTurnOwnedBy = isTurnOwnedBy;
function getOpponent(ctxId, playerId) {
    var game = get(ctxId);
    var player = game.player1 === playerId ? game.player2 : game.player1;
    if (player === null) {
        throw new Error('Opponent not known');
    }
    return player;
}
exports.getOpponent = getOpponent;
function setWinMove(contextId, playerId, trailState) {
    updateGame(contextId, { winner: playerId, state: 'end', trailState: trailState });
}
exports.setWinMove = setWinMove;
function setLostMove(contextId, playerId, trailState) {
    var game = get(contextId);
    var winner = game.player1 === playerId ? game.player2 : game.player1;
    updateGame(contextId, { winner: winner, state: 'end', trailState: trailState });
}
exports.setLostMove = setLostMove;
function getGameState(contextId) {
    var game = get(contextId);
    return game.game.state;
}
exports.getGameState = getGameState;
function challenge(contextId, playerId) {
    updateGame(contextId, { challengedAgainBy: playerId });
}
exports.challenge = challenge;
//# sourceMappingURL=model.js.map
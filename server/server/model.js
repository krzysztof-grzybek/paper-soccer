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
function createNewGame(contextId, playerId) {
    return {
        contextId: contextId,
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
    var game = createNewGame(contextId, playerId);
    db[contextId] = game;
    fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db));
    return game;
}
exports.create = create;
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
    return get(contextId).game.currentTurn === playerId;
}
exports.isTurnOwnedBy = isTurnOwnedBy;
function getOpponent(ctxId, playerId) {
    var game = get(ctxId);
    return game.player1 === playerId ? game.player2 : game.player1;
}
exports.getOpponent = getOpponent;
function setWinMove(contextId, playerId, movesHistory) {
    updateGame(contextId, { winner: playerId, state: 'end', history: movesHistory });
}
exports.setWinMove = setWinMove;
function setLostMove(contextId, playerId, movesHistory) {
    var game = get(contextId);
    var winner = game.player1 === playerId ? game.player2 : game.player1;
    updateGame(contextId, { winner: winner, state: 'end', history: movesHistory });
}
exports.setLostMove = setLostMove;
//# sourceMappingURL=model.js.map
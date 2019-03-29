"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("./model");
function controller(socket) {
    console.log('User is connected !');
    var playerId = null;
    var contextId = null;
    socket.on('init', function (data) {
        console.log('init action');
        var ctxId = data.contextId, pId = data.playerId;
        var session = socket.adapter.rooms[ctxId];
        if (session && session.length >= 2) {
            console.log('Error - to many people in the room');
            return;
        }
        playerId = pId;
        contextId = ctxId;
        socket.join(ctxId);
        var game = null;
        if (model_1.exists(ctxId)) {
            game = model_1.get(ctxId);
            if (!game.player2) {
                model_1.update(ctxId, { player2: pId });
                model_1.updateGame(ctxId, { currentTurn: pId });
                game = model_1.get(ctxId);
            }
        }
        else {
            game = model_1.create(ctxId, pId);
        }
        console.log('game loaded response ' + ctxId + ' ' + playerId);
        socket.emit('game-loaded', game);
        console.log('opponent connected response ' + ctxId + ' ' + playerId);
        socket.to(contextId).emit('opponent-connected', playerId);
    });
    socket.on('disconnect', function () {
        socket.leave(contextId);
    });
    socket.on('move', function (_a) {
        var type = _a.type, trailState = _a.trailState;
        if (!model_1.isTurnOwnedBy(contextId, playerId)) {
            return;
        }
        if (type === 'progress') {
            var opponent = model_1.getOpponent(contextId, playerId);
            model_1.updateGame(contextId, { currentTurn: opponent, trailState: trailState });
            socket.to(contextId).emit('opponent-moved', { type: 'progress', trailState: trailState });
        }
        else if (type === 'win') {
            model_1.setWinMove(contextId, playerId, trailState);
            socket.to(contextId).emit('opponent-moved', { type: 'loss', trailState: trailState });
        }
        else if (type === 'loss') {
            model_1.setLostMove(contextId, playerId, trailState);
            socket.to(contextId).emit('opponent-moved', { type: 'win', trailState: trailState });
        }
    });
    socket.on('challenge', function () {
        var winner = model_1.getGameState(contextId);
        if (winner !== 'end') {
            console.error('Cannot challenge during the game');
            return;
        }
        model_1.challenge(contextId, playerId);
        socket.to(contextId).emit('challenged', { challengedAgainBy: playerId });
    });
    socket.on('start-new-game', function (callback) {
        var game = model_1.create(contextId, playerId);
        callback(game);
        socket.to(contextId).emit('new-game-started', game);
    });
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map
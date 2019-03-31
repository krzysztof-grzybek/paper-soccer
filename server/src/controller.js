"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("./model");
function controller(socket) {
    console.log('Session started');
    var playerId;
    var contextId;
    socket.on('init', function (data) {
        console.log('Init session');
        var ctxId = data.contextId, pId = data.playerId;
        var session = socket.adapter.rooms[ctxId];
        if (session && session.length >= 2) {
            console.error('Error - to many people in the room.');
            return;
        }
        playerId = pId;
        contextId = ctxId;
        socket.join(contextId);
        var context;
        if (model_1.exists(contextId)) {
            context = model_1.get(contextId);
            if (playerId !== context.player1 && !context.player2) {
                model_1.update(contextId, { player2: playerId });
                if (context.game.currentTurn === 'unknown-player') {
                    model_1.updateGame(contextId, { currentTurn: playerId });
                }
                context = model_1.get(contextId);
            }
            else if (context.player1 &&
                context.player2 &&
                playerId !== context.player1 &&
                playerId !== context.player2) {
                console.error('Error - only 2 players can play in single context.');
                return;
            }
        }
        else {
            context = model_1.create(contextId, playerId);
        }
        socket.emit('game-loaded', context);
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
            try {
                var opponent = model_1.getOpponent(contextId, playerId);
                model_1.updateGame(contextId, { currentTurn: opponent, trailState: trailState });
            }
            catch (_b) {
                model_1.updateGame(contextId, { trailState: trailState, currentTurn: 'unknown-player' });
            }
        }
        else if (type === 'win') {
            model_1.setWinMove(contextId, playerId, trailState);
        }
        else if (type === 'loss') {
            model_1.setLostMove(contextId, playerId, trailState);
        }
        socket.to(contextId).emit('opponent-moved', { type: type, trailState: trailState });
    });
    socket.on('challenge', function () {
        var gameState = model_1.getGameState(contextId);
        if (gameState !== 'end') {
            console.error('Cannot challenge during the game');
            return;
        }
        model_1.challenge(contextId, playerId);
        socket.to(contextId).emit('challenged', { challengedAgainBy: playerId });
    });
    socket.on('start-new-game', function (callback) {
        var context = model_1.createGame(contextId, playerId);
        callback(context);
        socket.to(contextId).emit('new-game-started', context);
    });
    socket.on('is-opponent-connected', function (callback) {
        var session = socket.adapter.rooms[contextId];
        var isOpponentConnected = session && session.length === 2;
        callback(isOpponentConnected);
    });
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map
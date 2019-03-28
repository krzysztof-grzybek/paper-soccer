"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var socketIo = require("socket.io");
var model_1 = require("./model");
var port = process.env.PORT || 3001;
var options = function () { return ({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
}); };
var app = express();
app.use(cors());
var server = process.env.NODE_ENV === 'prod'
    ? http.createServer({}, app)
    : https.createServer(options(), app);
var io = socketIo(server, { origins: '*:*' });
io.on('connection', function (socket) {
    console.log('User is connected !');
    var playerId = null;
    var contextId = null;
    socket.on('init', function (data) {
        var ctxId = data.contextId, pId = data.playerId;
        var session = io.sockets.adapter.rooms[ctxId];
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
            }
        }
        else {
            game = model_1.create(ctxId, pId);
        }
        socket.emit('game-loaded', game);
        socket.emit('opponent-connected', playerId);
    });
    socket.on('disconnect', function () {
        socket.leave(contextId);
    });
    socket.on('move', function (_a) {
        var type = _a.type, history = _a.history;
        if (!model_1.isTurnOwnedBy(contextId, playerId)) {
            return;
        }
        if (type === 'progress') {
            var opponent = model_1.getOpponent(contextId, playerId);
            model_1.updateGame(contextId, { currentTurn: opponent, history: history });
            socket.to(contextId).emit('opponent-moved', { type: 'progress', history: history });
        }
        else if (type === 'win') {
            model_1.setWinMove(contextId, playerId, history);
            socket.to(contextId).emit('opponent-moved', { type: 'loss', history: history });
        }
        else if (type === 'loss') {
            model_1.setLostMove(contextId, playerId, history);
            socket.to(contextId).emit('opponent-moved', { type: 'win', history: history });
        }
    });
});
app.get('/', function (req, res) {
    res.send('PAPER-SOCCER');
});
/* tslint:disable:no-console */
server.listen(port, function () { return console.log("App is listening on port " + port + "!"); });
//# sourceMappingURL=index.js.map
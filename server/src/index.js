"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var socketIo = require("socket.io");
var bot_1 = require("./bot");
var controller_1 = require("./controller");
var port = process.env.PORT || 3001;
var options = function () { return ({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
}); };
var app = express();
app.use(cors());
app.use('/bot', bot_1.router);
var server = process.env.NODE_ENV === 'prod'
    ? http.createServer({}, app)
    : https.createServer(options(), app);
var io = socketIo(server, { origins: '*:*' });
io.on('connection', controller_1.controller);
app.get('/', function (req, res) {
    res.send('PAPER-SOCCER');
});
/* tslint:disable:no-console */
server.listen(port, function () { return console.log("App is listening on port " + port + "!"); });
//# sourceMappingURL=index.js.map
/* tslint:disable:no-console */

import cors = require('cors');
import express = require('express');
import fs = require('fs');
import http = require('http');
import https = require('https');
import socketIo = require('socket.io');
import { router } from './bot';

import { controller } from './controller';

const port = process.env.PORT || 3001;
const options = () => ({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
});

const app = express();
app.use(cors());
app.use('/bot', router);

const server = process.env.NODE_ENV === 'prod'
  ? http.createServer({}, app)
  : https.createServer(options(), app);
const io = socketIo(server, { origins: '*:*'});

io.on('connection', controller);

app.get('/', (req, res) => {
  res.send('PAPER-SOCCER');
});

/* tslint:disable:no-console */
server.listen(port, () => console.log(`App is listening on port ${port}!`));

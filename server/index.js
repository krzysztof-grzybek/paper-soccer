const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');

const port = process.env.PORT || 3001;
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

const app = express();
const server = https.createServer(options, app);
const io = socketIo(server);

io.on('connection', socket => {

  console.log('User is connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('move', () => {
    console.log('user move');
  });

});


server.listen(port, () => console.log(`App is listening on port ${port}!`));

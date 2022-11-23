require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
// environment
const port = process.env.PORT;
const address = process.env.ADDRESS;

app.get('/', (req, res) => {
  res.send('hello');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });
  });

server.listen(port, () => {
  console.log(`listening on ${address}:${port}`);
});
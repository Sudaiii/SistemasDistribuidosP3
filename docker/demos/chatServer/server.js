require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const redis = require("socket.io-redis");
io.adapter(redis({ host: "localhost", port: 6379 }));

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// environment
const port = process.env.PORT;
const address = process.env.ADDRESS;
const serveruuid = crypto.randomUUID();

app.get('/', (req, res) => {
  res.send('hello');
});

io.on('connection', (socket) => {
  const uuid = socket.id;
  var user = socket.id;
  console.log(`${uuid} connected`);
  io.to(user).emit('server message', `connected to: ${serveruuid}`);
  socket.on('disconnect', () => {
    console.log(`${uuid} disconnected`);
  });
  socket.on('chat message', (msg) => {
    console.log(`${uuid} says: ` + msg);
    io.emit('chat message', { message: msg, user: user });
  });
  socket.on('register', (data) => {
    console.log(`user ${uuid} registered as ${data.user}`);
    user = data.user;
  });
});

server.listen(port, () => {
  console.log(`listening on ${address}:${port}`);
});
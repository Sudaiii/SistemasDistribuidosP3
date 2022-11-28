require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");

const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = createClient({ url: "redis://192.168.18.221:6379" });
const subClient = pubClient.duplicate();

pubClient.connect();
subClient.connect();

pubClient.on("error", (err) => {
  console.log(err);
});
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
io.adapter(createAdapter(pubClient, subClient));
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
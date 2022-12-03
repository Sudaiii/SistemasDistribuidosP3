require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const serverport = process.env.SERVER_PORT;
const serveraddress = process.env.SERVER_ADDRESS;

app.use(express.static(__dirname + '/node_modules'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/auction.html');
  });

  server.listen(process.env.PORT, () => {
    console.log(`listening on ${serveraddress}:${process.env.PORT}`);
  });

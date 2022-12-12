require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(cors({ origin: '*' }));

app.use(express.static(__dirname + '/node_modules'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});
app.get('/auction', (req, res) => {
    res.sendFile(__dirname + '/auction.html');
  });


  server.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.FRONT_ADDRESS}`);
  });

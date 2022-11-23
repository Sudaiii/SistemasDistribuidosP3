const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3001;

app.use(express.static(__dirname + '/node_modules'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });
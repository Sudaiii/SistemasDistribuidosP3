// Packages Imports
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");

//const uri = "mongodb://localhost:27017/aunt-rich"
const uri = process.env.DB_CONNECTION;

// Router Imports
const auctionRouter = require('./routes/auctionRouter');
const userRouter = require('./routes/userRouter');

// App Settings and Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

//database connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect to the database"))
  .catch((err) => console.log(err));

// Configuring port
//const port = 3001;
const port = process.env.PORT;

// Routes definition
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auction', auctionRouter);
app.use('/user', userRouter);

// App Serving
app.listen(port);
console.log(`Listening On http://localhost:${port}/`);

module.exports = app;

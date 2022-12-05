// Packages Imports
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const moongoose = require("mongoose");

// Router Imports
const testRouter = require('./routes/testRouter');
const userRouter = require('./routes/userRouter');
const eventRouter = require('./routes/eventRouter');
const postRouter = require('./routes/postRouter');
const groupRouter = require('./routes/groupRouter');
const projectRouter = require('./routes/projectRouter');
const requestRouter = require('./routes/requestRouter');

// App Settings and Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

//database connection
moongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect to the database"))
  .catch((err) => console.log(err));

// Configuring port
const port = process.env.PORT || 9000;

// Routes definition
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/events', eventRouter);
app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/post', postRouter);
app.use('/group', groupRouter);
app.use('/project', projectRouter);
app.use('/request', requestRouter);

// App Serving
app.listen(port);
console.log(`Listening On http://localhost:${port}/`);

module.exports = app;

const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/get/:name', userController.getUserByName);

userRouter.get('/getUserAuctions/:name', userController.getUserAuctions);

userRouter.post('/logIn/', userController.logIn);

module.exports = userRouter;
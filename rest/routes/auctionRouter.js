const express = require('express');
const auctionController = require('../controllers/auctionController');

const auctionRouter = express.Router();

auctionRouter.get('/get-all', auctionController.getAuctions);

auctionRouter.get('/get/:item', auctionController.getAuctionByItem);

auctionRouter.get('/getAuctionParticipants/:item', auctionController.getAuctionParticipants);

auctionRouter.get('/getAuctionParticipants/:item', auctionController.getAuctionLog);


module.exports = auctionRouter;
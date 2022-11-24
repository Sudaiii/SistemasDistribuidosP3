const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
//const auctionManager = new AuctionManager()

//db things
const db = require('./database');

async function start(){
    await db.init();
    /*const res =  await db.Auctions.addAuction('Tallarines');
    console.log(res);
    const res2 = await db.Auctions.addLog('Tallarines', 'Ha ofertado 200 por Tallarines');
    console.log(res2);
    const res3 = await db.Auctions.readLog('Tallarines')
    console.log(res3);
    const res4 = await db.Auctions.getAllAuctions();
    console.log(res4);*/
    const res5 = await db.Auctions.getAllAuctionsList();
    console.log(res5)
    //const res6 = await db.Auctions.deleteAuction('Tallarines');
    //console.log(res6);
    const res7 = await db.Auctions.setStarted("Tallarines", true);
    const res8 = await db.Auctions.getStarted("Tallarines");
    console.log(res8);
}

start();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    socket.on('join', (data) => {
        console.log(socket.id + ': ' + data.userID + ' joins ' + data.auctionID);
        let result = auctionManager.addUserToAuction(data.userID, data.auctionID);
        if(result === 2){
            socket.join(data.auctionID);
            socket.emit('result', 'Success: User joined auction');
            io.to(data.auctionID).emit('message', (data.userID + ' has joined the auction'));
        }
        else if(result === 1){
            socket.emit('result', 'Error: User already in auction');
        }
        else if(result === 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    socket.on('leave', (data) => {
        console.log(socket.id + ': ' + data.userID + ' leaves ' + data.auctionID);
        let result = auctionManager.removeUserFromAuction(data.userID, data.auctionID);
        if(result === 2){
            socket.leave(data.auctionID);
            socket.emit('result', 'Success: User left auction');
            io.to(data.auctionID).emit('message', (data.userID + ' has left the auction'));
        }
        else if(result === 1){
            socket.emit('result', 'Error: User in auction');
        }
        else if(result === 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    //      amount: amount offered
    socket.on('offer', (data) => {
        console.log(socket.id + ': ' + data.userID + ' offers ' + data.auctionID + ' amount ' + data.amount);
        let result = auctionManager.offer(data.userID, data.auctionID, data.amount);
        if(result === 3){
            socket.emit('result', 'Success: Offer of ' + data.amount + 'made for ' + data.auctionID);
            io.to(data.auctionID).emit('message', (data.userID + ' has offered ' + data.amount));
        }
        else if(result === 2){
            socket.emit('result', 'Error: Offer lower than current best offer');
        }
        else if(result === 1){
            socket.emit('result', 'Error: User not in auction');
        }
        else if(result === 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});


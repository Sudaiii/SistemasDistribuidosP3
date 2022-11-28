const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const AuctionManager = require('./auction_manager');
const auctionManager = new AuctionManager();

async function start(){
    await auctionManager.start();
}

//TODO: extraHeaders
io.on('connection', async (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    socket.on('join', async (data) => {
        console.log(socket.id + ': ' + data.userID + ' joins ' + data.auctionID);
        let result = auctionManager.addUserToAuction(data.userID, data.auctionID);
        if(result == 2){
            socket.join(data.auctionID);
            socket.emit('result', 'Success: User joined auction');
            io.to(data.auctionID).emit('message', (data.userID + ' has joined the auction'));
        }
        else if(result == 1){
            socket.emit('result', 'Error: User already in auction');
        }
        else if(result == 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    socket.on('leave', async (data) => {
        console.log(socket.id + ': ' + data.userID + ' leaves ' + data.auctionID);
        let result = auctionManager.removeUserFromAuction(data.userID, data.auctionID);
        if(result == 2){
            socket.leave(data.auctionID);
            socket.emit('result', 'Success: User left auction');
            io.to(data.auctionID).emit('message', (data.userID + ' has left the auction'));
        }
        else if(result == 1){
            socket.emit('result', 'Error: User in auction');
        }
        else if(result == 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    // data:
    //      userID: ID of the user
    //      auctionID: ID of the auction
    //      amount: amount offered
    socket.on('offer', async (data) => {
        console.log(socket.id + ': ' + data.userID + ' offers ' + data.auctionID + ' amount ' + data.amount);
        let result = auctionManager.offer(data.userID, data.auctionID, data.amount);
        if(result == 3){
            socket.emit('result', 'Success: Offer of ' + data.amount + 'made for ' + data.auctionID);
            io.to(data.auctionID).emit('message', (data.userID + ' has offered ' + data.amount));
        }
        else if(result == 2){
            socket.emit('result', 'Error: Offer lower than current best offer');
        }
        else if(result == 1){
            socket.emit('result', 'Error: User not in auction');
        }
        else if(result === 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    // socket.on('chat message', async (data) => {
    //     console.log(data);
    //     if(data == "join"){
    //         await auctionManager.addUserToAuction("Tallarines", "2121");
    //     }
    //     else if(data == "leave"){
    //         await auctionManager.removeUserFromAuction("Tallarines", "2121")
    //     }
    //     else if(data == "offer"){
    //         await auctionManager.offer("Tallarines", "2121", 555);
    //     }
    // });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

await start();








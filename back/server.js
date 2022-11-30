const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
const AuctionManager = require('./auction_manager');
const auctionManager = new AuctionManager();

// const { createClient } = require("redis");
// const { createAdapter } = require("@socket.io/redis-adapter");

// const pubClient = createClient({ url: "redis://192.168.18.221:6379" });
// const subClient = pubClient.duplicate();
//
// pubClient.connect();
// subClient.connect();
//
// pubClient.on("error", (err) => {
//     console.log(err.message);
// });
//
// subClient.on("error", (err) => {
//     console.log(err.message);
// });

// io.adapter(createAdapter(pubClient, subClient));

async function start(){
    await auctionManager.start();
}

//TODO: extraHeaders
io.on('connection', async (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('join', async (data) => {
        // data:
        //      userRole: role of the user.
        //      userID: ID of the user
        //      auctionID: ID of the auction
        console.log(socket.id + ': ' + data.userID + ' joins ' + data.auctionID);
        let result = await auctionManager.addUserToAuction(data.userID, data.auctionID);
        if(result == 2){
            socket.join(data.auctionID);
            socket.emit('result', 'Success: User joined auction');
            if(data.userRole !== 'hammerman'){
                io.to(data.auctionID).emit('message', (data.userID + ' has joined the auction'));
            }
        }
        else if(result == 1){
            socket.emit('result', 'Error: User already in auction');
        }
        else if(result == 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    socket.on('leave', async (data) => {
        // data:
        //      userRole: role of the user.
        //      userID: ID of the user
        //      auctionID: ID of the auction
        console.log(socket.id + ': ' + data.userID + ' leaves ' + data.auctionID);
        let result = await auctionManager.removeUserFromAuction(data.userID, data.auctionID);
        if(result == 2){
            socket.leave(data.auctionID);
            socket.emit('result', 'Success: User left auction');
            if(data.userRole !== 'hammerman'){
                io.to(data.auctionID).emit('message', (data.userID + ' has left the auction'));
            }
        }
        else if(result == 1){
            socket.emit('result', 'Error: User in auction');
        }
        else if(result == 0){
            socket.emit('result', 'Error: Auction not available');
        }
    });
    socket.on('offer', async (data) => {
        // data:
        //      userRole: role of the user. Can't be a hammerman
        //      userID: ID of the user
        //      auctionID: ID of the auction
        //      amount: amount offered
        console.log(socket.id + ': ' + data.userID + ' offers ' + data.auctionID +' amount ' + data.amount);
        if(data.userRole === 'hammerman'){
            socket.emit('result', 'Error: Hammerman is not authorized to make offers');
        }
        else{
            let result = await auctionManager.offer(data.userID, data.auctionID, data.amount);
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
        }
    });
    socket.on('finish', async (data) => {
        // data:
        //      userRole: role of the user. Must be a hammerman
        //      auctionID: ID of the auction
        console.log(socket.id + ': finished ' + data.auctionID);
        if(data.userRole === 'hammerman'){
            let result = await auctionManager.finishAuction(data.auctionID);
            if(result === 1){
                socket.emit('result', 'Success: Auction finished');
                let winner = await auctionManager.getAuctionWinner(data.auctionID);
                io.to(data.auctionID).emit('message',
                    ('La subasta ha finalizado' +
                        'Ganador: ' + winner.Offeror +
                        'Oferta: ' + winner.Offer));
                io.to(winner.Offeror).emit('notification', ('Won auction ' + data.auctionID));
            }
            else{
                socket.emit('error', 'Error: Auction already finished or does not exist');
            }

        }
        else{
            socket.emit('result', 'Error: User not authorized');
        }
    });
    socket.on('hammerman message', async (data) => {
        // data:
        //      userRole: role of the user. Must be a hammerman
        //      auctionID: ID of the auction
        //      message: the message the hammerman wants to communicate
        console.log(socket.id + ': ' + data.message);
        if(data.userRole === 'hammerman'){
            socket.emit('result', 'Success: Message sent');
            io.to(data.auctionID).emit('message', (data.message));
        }
        else{
            socket.emit('result', 'Error: User not authorized');
        }
    });
    // Test case
    socket.on('chat message', async (data) => {
        console.log(data);
        if(data == "join"){
            await auctionManager.addUserToAuction("Tallarines", "2121");
        }
        else if(data == "leave"){
            await auctionManager.removeUserFromAuction("Tallarines", "2121")
        }
        else if(data == "offer"){
            await auctionManager.offer("Tallarines", "2121", 555);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

start();








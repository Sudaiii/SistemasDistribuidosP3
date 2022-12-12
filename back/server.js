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

const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = createClient({ url: process.env.MANAGER_IP });
const subClient = pubClient.duplicate();

pubClient.connect();
subClient.connect();

pubClient.on("error", (err) => {
    console.log(err.message);
});

subClient.on("error", (err) => {
    console.log(err.message);
});

io.adapter(createAdapter(pubClient, subClient));

async function start(){
    await auctionManager.start();
}

io.on('connection', async (socket) => {
    let user = undefined;
    let role = 'user';

    socket.emit('handshake', 'user: ?');

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('identify', async (data) => {
        user = data.user;
        socket.join(user);
        console.log(socket.id + " has identified as " + user);
        let roleData = await auctionManager.getUserRole(user);
        if(roleData.hasOwnProperty('Role')){
            role = roleData.Role;
            socket.join(role);
            console.log(socket.id + " is " + role);
        }
        let auctions = await auctionManager.getUserAuctions(user);
        console.log(auctions);
        if(auctions.hasOwnProperty('Auctions')){
            for (const auction of auctions.Auctions) {
                socket.join(auction);
                console.log(socket.id + " has joined " + auction);
            }
        }
    });
    socket.on('join', async (data) => {
        // data:
        //      item: item of the auction
        console.log(socket.id + ': ' + user + ' joins ' + data.item);
        let result = await auctionManager.addUserToAuction(data.item, user);
        //console.log(data)
        //console.log(result);
        if(result == 2){

            socket.join(data.item);
            socket.emit('result', 'Success: User joined auction');
            if(role !== 'hammerman'){
                io.to(data.item).emit('message', (user + ' has joined the auction'));
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
        //      item: item of the auction
        console.log(socket.id + ': ' + user + ' leaves ' + data.item);
        let result = await auctionManager.removeUserFromAuction(data.item, user);
        if(result == 2){
            socket.leave(data.item);
            socket.emit('result', 'Success: User left auction');
            if(role !== 'hammerman'){
                io.to(data.item).emit('message', (user + ' has left the auction'));
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
        //      item: item of the auction
        //      amount: amount offered
        console.log(data);
        console.log(socket.id + ': ' + user + ' offers ' + data.item +' amount ' + data.amount);
        if(role === 'hammerman'){
            socket.emit('result', 'Error: Hammerman is not authorized to make offers');
        }
        else{
            let result = await auctionManager.offer(data.item, user, data.amount);
            if(result == 3){
                socket.emit('result', 'Success: Offer of ' + data.amount + 'made for ' + data.item);
                io.to(data.item).emit('message', (user + ' has offered ' + data.amount));
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
        //      item: item of the auction
        console.log(socket.id + ': finished ' + data.item);
        if(role === 'hammerman'){
            let result = await auctionManager.finishAuction(data.item);
            if(result === 1){
                socket.emit('result', 'Success: Auction finished');
                let winner = await auctionManager.getAuctionWinner(data.item);
                io.to(data.item).emit('message',
                    ('The auction is over.' +
                        ' Winner: ' + winner.Offeror +
                        ', Final bid: ' + winner.Offer));
                console.log('Winner: ' + winner.Offeror + ', Final bid: ' + winner.Offer);
                io.to(winner.Offeror).emit('notification', ('Won auction ' + data.item));
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
        //      item: item of the auction
        //      message: the message the hammerman wants to communicate
        console.log(socket.id + ': ' + data.message);
        if(role === 'hammerman'){
            console.log('in o no?')
            socket.emit('result', 'Success: Message sent');
            io.to(data.item).emit('message', ('HammerMessage' + data.message));
        }
        else{
            socket.emit('result', 'Error: User not authorized');
        }
    });
    //Test case
    socket.on('chat message', async (data) => {
        console.log(user)
        console.log(data);
        if(data == "join"){
            await auctionManager.addUserToAuction("Tallarines", user);
        }
        else if(data == "leave"){
            await auctionManager.removeUserFromAuction("Tallarines", user)
        }
        else if(data == "offer"){
            await auctionManager.offer("Tallarines", user, 555);
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








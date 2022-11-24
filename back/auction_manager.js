const db = require('./database');

class AuctionManager {
    constructor() {
        this.auctions = [];
    }

    async start(){
        await db.init();
        const ad = await db.dbw.addAuction("Tallarines")
        const ad2 = await db.dbw.setGUID("Tallarines", 4)
        const res = await db.dbw.addParticipant("Tallarines",1)
        const res2 = await db.dbw.addParticipant("Tallarines",2)
        const res3 = await db.dbw.removeParticipant("Tallarines", 2)

        const res5 = await db.dbw.setFinished("Tallarines", true)
        const res4 = await db.dbw.isAuctionAvailable("Tallarines")
        console.log(res4)

        const res6 = await db.dbw.containsUser("Tallarines", 8);
        console.log("existe participante ",res6)
    }

    initiateAuction(auctionID){
        if(this.auctions.includes(auctionID)){
            return true;
        }
        else{
            // if(db.isAuctionAvailable(auctionID)){
            //     db.setGUID(auctionID, server.guid);
            //     De donde se saca este guid? No lo se
            //     this.auctions.push(auctionID)
            //     return true;
            // }
            // else{
            //     return false;
            // }
        }
    }

    addUserToAuction(auctionID, userID){
        if(this.initiateAuction()){
            // if(db.containsUser(auctionID, userID){
            //     return 1;
            // }
            // else{
            //     db.addUser(auctionID, userID);
            //     return 2;
            // }
        }
        else {
            return 0;
        }
    }

    //TODO: Leave restrictions
    removeUserFromAuction(auctionID,  userID){
        if(this.initiateAuction()){
            // if(!db.containsUser(auctionID, userID){
            //     return 1;
            // }
            // else{
            //     db.removeUser(auctionID, userID);
            //     return 2;
            // }
        }
        else {
            return 0;
        }
    }

    offer(auctionID, userID, amount){
        if(this.initiateAuction()){
            // if(db.containsUser(auctionID, userID){
            //     return 1;
            // }
            // else if(amount <= db.getBestOffer(auctionID)){
            //     return 2;
            // }
            // else{
            //     db.setBestOffer(auctionID, amount);
            //     db.setBestOfferor(auctionID, userID);
            //     return 3;
            // }
        }
        else {
            return 0;
        }
    }
    //TODO: Hammer logic
}

module.exports = AuctionManager;

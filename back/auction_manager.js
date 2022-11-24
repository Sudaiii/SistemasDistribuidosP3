const db = require('./database');

class AuctionManager {
    constructor() {
        this.auctions = [];
    }

    async start(){
        await db.init();
    }

    async initiateAuction(auctionID){
        if(this.auctions.includes(auctionID)){
            return true;
        }
        else{
            if(await db.dbw.isAuctionAvailable(auctionID)){
                //TODO: where does the guid come from?
                await db.dbw.setGUID(auctionID, 0);
                this.auctions.push(auctionID);
                return true;
            }
            else{
                return false;
            }
        }
    }

    async addUserToAuction(auctionID, userID){
        if(await this.initiateAuction(auctionID)){
            let contains = await db.dbw.containsUser(auctionID, userID)
            if(contains){
                return 1;
            }
            else{
                await db.dbw.addParticipant(auctionID, userID);
                return 2;
            }
        }
        else {
            return 0;
        }
    }

    //TODO: restrictions?
    async removeUserFromAuction(auctionID,  userID){
        if(await this.initiateAuction(auctionID)){
            if(!await db.dbw.containsUser(auctionID, userID)){
                return 1;
            }
            else{
                await db.dbw.removeParticipant(auctionID, userID)
                return 2;
            }
        }
        else {
            return 0;
        }
    }

    async offer(auctionID, userID, amount){
        if(await this.initiateAuction(auctionID)){
            if(!await db.dbw.containsUser(auctionID, userID)){
                return 1;
            }
            else if(amount <= await db.dbw.getBestOffer(auctionID)){
                return 2;
            }
            else{
                await db.dbw.setBestOffer(auctionID, amount);
                await db.dbw.setBestOfferor(auctionID, userID);
                return 3;
            }
        }
        else {
            return 0;
        }
    }
    //TODO: Hammer logic
}

module.exports = AuctionManager;

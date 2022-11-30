const db = require('./database');

class AuctionManager {
    constructor() {
    }

    async start(){
        await db.init();

        const ad = await db.dbw.addAuction("Tallarines");
    }

    async addUserToAuction(auctionID, userID){
        if(await db.dbw.isAuctionAvailable(auctionID)){
            let contains = await db.dbw.containsUser(auctionID, userID)
            if(contains){
                return 1;
            }
            else{
                await db.dbw.addParticipant(auctionID, userID);
                await db.dbw.addLog(auctionID, userID + " has joined auction " + auctionID);
                return 2;
            }
        }
        else {
            return 0;
        }
    }

    async removeUserFromAuction(auctionID, userID){
        if(await db.dbw.isAuctionAvailable(auctionID)){
            if(!await db.dbw.containsUser(auctionID, userID)){
                return 1;
            }
            else{
                await db.dbw.removeParticipant(auctionID, userID)
                await db.dbw.addLog(auctionID, userID + " has left auction " + auctionID);
                return 2;
            }
        }
        else {
            return 0;
        }
    }

    async offer(auctionID, userID, amount){
        if(await db.dbw.isAuctionAvailable(auctionID)){
            if(!await db.dbw.containsUser(auctionID, userID)){
                return 1;
            }
            else if(amount <= await db.dbw.getBestOffer(auctionID)){
                return 2;
            }
            else{
                await db.dbw.setBestOffer(auctionID, amount);
                await db.dbw.setBestOfferor(auctionID, userID);
                await db.dbw.addLog(auctionID, userID + " has offered " + amount + " to auction " + auctionID);
                return 3;
            }
        }
        else {
            return 0;
        }
    }

    async finishAuction(auctionID){
        if(await db.dbw.isAuctionAvailable(auctionID)){
            await db.dbw.setFinished(auctionID);
            await db.dbw.addLog(auctionID, auctionID + " has been finished");
            return 1;
        }
        else {
            return 0;
        }
    }

    async getAuctionWinner(auctionID){
        if(await db.dbw.isAuctionExisting(auctionID)){
            return {'Offeror': await db.dbw.getBestOfferor(auctionID), 'Offer': await db.dbw.getBestOffer(auctionID)};
        }
        else{
            return {'Error': 'Auction does not exist'};
        }
    }

}

module.exports = AuctionManager;

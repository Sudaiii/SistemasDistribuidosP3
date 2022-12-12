const db = require('./database');

class AuctionManager {
    constructor() {
    }

    async start(){
        await db.init();

        // const ad = await db.dbw.addAuction("Tallarines");
    }

    async addUserToAuction(item, username){
        if(await db.dbw.isAuctionAvailable(item)){
            let contains = await db.dbw.containsUser(item, username)
            if(contains){
                console.log('1 res');
                return 1;
            }
            else{
                await db.dbw.addParticipant(item, username);
                await db.dbw.addLog(item, username + " has joined auction " + item);
                console.log('2 res')
                return 2;
            }
        }
        else {
            console.log('0 rres')
            return 0;
        }
    }

    async removeUserFromAuction(item, username){
        if(await db.dbw.isAuctionAvailable(item)){
            if(!await db.dbw.containsUser(item, username)){
                return 1;
            }
            else{
                await db.dbw.removeParticipant(item, username)
                await db.dbw.addLog(item, username + " has left auction " + item);
                return 2;
            }
        }
        else {
            return 0;
        }
    }

    async offer(item, username, amount){
        if(await db.dbw.isAuctionAvailable(item)){
            if(!await db.dbw.containsUser(item, username)){
                return 1;
            }
            else if(amount <= await db.dbw.getBestOffer(item)){
                return 2;
            }
            else{
                await db.dbw.setBestOffer(item, amount);
                await db.dbw.setBestOfferor(item, username);
                await db.dbw.addLog(item, username + " has offered " + amount + " to auction " + item);
                return 3;
            }
        }
        else {
            return 0;
        }
    }

    async finishAuction(item){
        console.log('enter in finish auction')
        if(await db.dbw.isAuctionAvailable(item)){
            console.log('Entró o no?')
            await db.dbw.setFinished(item, true);
            await db.dbw.addLog(item, item + " has been finished");
            return 1;
        }
        else {
            return 0;
        }
    }

    async getAuctionWinner(item){
        if(await db.dbw.isAuctionExisting(item)){
            return {'Offeror': await db.dbw.getBestOfferor(item), 'Offer': await db.dbw.getBestOffer(item)};
        }
        else{
            return {'Error': 'Auction does not exist'};
        }
    }

    async getUserAuctions(username){
        if(await db.dbw.isUserExisting(username)){
            return {'Auctions': await db.dbw.getUserAuctions(username)};
        }
        else{
            return {'Error': 'User does not exist'};
        }
    }

    async getUserRole(username){
        if(await db.dbw.isUserExisting(username)){
            return {'Role': await db.dbw.getUserRole(username)};
        }
        else{
            return {'Error': 'User does not exist'};
        }
    }

}

module.exports = AuctionManager;

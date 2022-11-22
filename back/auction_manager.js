class AuctionManager {

    constructor() {
        this.auctions = []
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

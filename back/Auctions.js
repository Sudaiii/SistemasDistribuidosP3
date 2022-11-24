class Auction {
    constructor(db) {
        this.collection = db.collection('auctions');
    }

    async addAuction(itemName){
        const newAuction = await this.collection.insertOne( { item: itemName, participants: [], started: false, finished: false, bestOffer: 0, log:[] });
        return newAuction;
    }

    async addLog(item, log){
        const query = { item: item };
        const updateDocument = {
            $push : {"log": log}
        };
        const result = await this.collection.updateOne(query, updateDocument);
        return result;
    }

    async readLog(item){
        const query = { item: item};
        let auction = await this.collection.findOne(query);
        console.log(auction.log);
        return auction.log;

    }

    /**
     * @return {Array} return the array of auctions with all his attributes
     */
    async getAllAuctions(){
        let auctions = await this.collection.find().toArray();
        return auctions;
    }

    async getAllAuctionsList(){
        let auctions = await this.collection.find().toArray();
        let listNames = []
        for (const auction of auctions) {
            listNames.push(auction.item);
        }
        return listNames;
    }

    async deleteAuction(item){
        const query = { item: item};
        let delAuction = await this.collection.deleteOne(query);
        return delAuction;
    }

    async setStarted(item, state){
        const query = { item: item };
        const updateDocument = {
            $set : {"started": state}
        };
        const result = await this.collection.updateOne(query, updateDocument);
        return result;
    }

    async setFinished(item, state){
        const query = { item: item };
        const updateDocument = {
            $set : {"finished": state}
        };
        const result = await this.collection.updateOne(query, updateDocument);
        return result;
    }

    async setFinished(item, state){
        const query = { item: item };
        const updateDocument = {
            $set : {"finished": state}
        };
        const result = await this.collection.updateOne(query, updateDocument);
        return result;
    }

    async getStarted(item){
        const query = { item: item };
        const result = await this.collection.findOne(query);
        return result.started;
    }

    async getFinished(item){
        const query = { item: item };
        const result = await this.collection.findOne(query);
        return result.finished;
    }

}

module.exports = Auction;
class DBWrapper {
    constructor(db) {
        this.collection = db.collection('auctions');
    }

    async addAuction(itemName){
        const newAuction = await this.collection.insertOne( { item: itemName, participants: [], started: false, finished: false, bestOffer: 0, bestOfferor: 0, log:[], guid: 0});
        return newAuction;
    }

    async addLog(item, log){
        const query = { item: item };
        const updateDocument = {
            $push : {"log": log}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async readLog(item){
        const query = { item: item};
        let auction = await this.collection.findOne(query);
        console.log(auction.log);
        return auction.log;

    }

    /**
     * @return {Array} return an array with all auctions and their attributes
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
        return await this.collection.updateOne(query, updateDocument);
    }

    async setFinished(item, state){
        const query = { item: item };
        const updateDocument = {
            $set : {"finished": state}
        };
        return await this.collection.updateOne(query, updateDocument);
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

    async addParticipant(item, id){
        const query = { item: item };
        const updateDocument = {
            $push : {"participants": id}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async removeParticipant(item, id){
        const query = { item: item };
        const updateDocument = {
            $pull : {"participants": id}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async isAuctionAvailable(item){
        const query = { item: item, finished: false}
        return await this.collection.count(query) > 0;
    }

    async containsUser(item, userID){
        const query = { item: item }
        let document = await this.collection.findOne(query)
        for (const value of document.participants) {
            if (value === userID){
                return true;
            }
        }
        return false;
    }

    async setBestOffer(item, amount){
        const query = { item: item };
        const updateDocument = {
            $set : {"bestOffer": amount}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async getBestOffer(item){
        const query = { item: item};
        let document = await this.collection.findOne(query)
        return document.bestOffer;
    }

    async setBestOfferor(item, userID){
        const query = { item: item };
        const updateDocument = {
            $set : {"bestOfferor": userID}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async getBestOfferor(item){
        const query = { item: item};
        let document = await this.collection.findOne(query)
        return document.bestOfferor;
    }
}

module.exports = DBWrapper;
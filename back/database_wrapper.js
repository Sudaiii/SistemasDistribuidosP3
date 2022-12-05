const img_holder = require("./img_holder")
const imageHolder = new img_holder();

class DBWrapper {
    constructor(db) {
        this.collection = db.collection('auction');
    }

    async addAuction(itemName){
        if (await this.collection.count({item: itemName})>0){
            console.log("The item", itemName, "is already an auction")
            return false;
        }else{
            return await this.collection.insertOne({
                item: itemName,
                participants: [],
                finished: false,
                bestOffer: 0,
                bestOfferor: 0,
                log: [],
                img: imageHolder.placeholderimage()
            });
        }

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
        return await this.collection.find().toArray();
    }

    /**
     * @return {Array} return an array with all auctions names
     */
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
        return await this.collection.deleteOne(query);
    }

    async setStarted(item, state){
        const query = { item: item };
        const docQuery = await this.collection.findOne(query)
        if (docQuery.started === state){
            console.log(item, "is already in started state:", state);
            return false
        }else{
            const updateDocument = {
                $set : {"started": state}
            };
            return await this.collection.updateOne(query, updateDocument);
        }
    }

    async setFinished(item, state){
        const query = { item: item };
        const docQuery = await this.collection.findOne(query)
        if (docQuery.finished === state){
            console.log(item, "is already in finished state:", state);
            return false
        }else{
            const updateDocument = {
                $set : {"finished": state}
            };
            return await this.collection.updateOne(query, updateDocument);
        }

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
        if (await this.containsUser(item, id)){
            console.log("The participant with the id", id, "is already participating on the auction");
            return false;
        }else{
            const query = { item: item };
            const updateDocument = {
                $push : {"participants": id}
            };
            return await this.collection.updateOne(query, updateDocument);
        }

    }

    async removeParticipant(item, id){
        const query = { item: item };
        const updateDocument = {
            $pull : {"participants": id}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async isAuctionExisting(item){
        const query = { item: item}
        return await this.collection.count(query) > 0;
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

    async setImage(item, image){
        const query = { item: item };
        const updateDocument = {
            $set : {"img": image}
        };
        return await this.collection.updateOne(query, updateDocument);
    }

    async setDefaultImage(item){
        const query = { item: item };
        const updateDocument = {
            $set : {"img": imageHolder.placeholderimage()}
        };
        return await this.collection.updateOne(query, updateDocument);
    }
}

module.exports = DBWrapper;
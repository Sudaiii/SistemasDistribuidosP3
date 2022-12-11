const img_holder = require("./img_holder")
const imageHolder = new img_holder();

class DBWrapper {
    constructor(db) {
        this.auctionCollection = db.collection('auctions');
        this.userCollection = db.collection('users');

    }

    async addAuction(itemName){
        if (await this.auctionCollection.count({item: itemName})>0){
            console.log("The item", itemName, "is already an auction")
            return false;
        }else{
            return await this.auctionCollection.insertOne({
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
        return await this.auctionCollection.updateOne(query, updateDocument);
    }

    async readLog(item){
        const query = { item: item};
        let auction = await this.auctionCollection.findOne(query);
        console.log(auction.log);
        return auction.log;

    }

    /**
     * @return {Array} return an array with all auctions and their attributes
     */
    async getAllAuctions(){
        return await this.auctionCollection.find().toArray();
    }

    /**
     * @return {Array} return an array with all auctions names
     */
    async getAllAuctionsList(){
        let auctions = await this.auctionCollection.find().toArray();
        let listNames = []
        for (const auction of auctions) {
            listNames.push(auction.item);
        }
        return listNames;
    }

    async deleteAuction(item){
        const query = { item: item};
        return await this.auctionCollection.deleteOne(query);
    }

    async setStarted(item, state){
        const query = { item: item };
        const docQuery = await this.auctionCollection.findOne(query)
        if (docQuery.started === state){
            console.log(item, "is already in started state:", state);
            return false
        }else{
            const updateDocument = {
                $set : {"started": state}
            };
            return await this.auctionCollection.updateOne(query, updateDocument);
        }
    }

    async setFinished(item, state){
        const query = { item: item };
        const docQuery = await this.auctionCollection.findOne(query)
        if (docQuery.finished === state){
            console.log(item, "is already in finished state:", state);
            return false
        }else{
            const updateDocument = {
                $set : {"finished": state}
            };
            return await this.auctionCollection.updateOne(query, updateDocument);
        }

    }

    async getStarted(item){
        const query = { item: item };
        const result = await this.auctionCollection.findOne(query);
        return result.started;
    }

    async getFinished(item){
        const query = { item: item };
        const result = await this.auctionCollection.findOne(query);
        return result.finished;
    }

    async addParticipant(item, username){
        if (await this.containsUser(item, username)){
            console.log("The participant with the username", username, "is already participating on the auction");
            return false;
        }else{
            const auctionQuery = { item: item };
            const auctionUpdate = {
                $push : {"participants": username}
            };
            await this.auctionCollection.updateOne(auctionQuery, auctionUpdate);

            const userQuery = { item: item };
            const userUpdate = {
                $push : {"auctions": item}
            };
            await this.userCollection.updateOne(userQuery, userUpdate);

            return true
        }
    }

    async removeParticipant(item, username){
        if (!await this.containsUser(item, username)){
            console.log("The participant with the username", username, "is not participating on the auction");
            return false;
        }else{
            const auctionQuery = { item: item };
            const auctionUpdate = {
                $pull : {"participants": username}
            };
            await this.auctionCollection.updateOne(auctionQuery, auctionUpdate);

            const userQuery = { item: item };
            const userUpdate = {
                $pull : {"auctions": item}
            };
            await this.userCollection.updateOne(userQuery, userUpdate);

            return true
        }

    }

    async isAuctionExisting(item){
        const query = { item: item}
        return await this.auctionCollection.count(query) > 0;
    }

    async isUserExisting(username){
        const query = { name: username}
        return await this.userCollection.count(query) > 0;
    }

    async isAuctionAvailable(item){
        const query = { item: item, finished: false}
        return await this.auctionCollection.count(query) > 0;
    }

    async containsUser(item, username){
        const query = { item: item }
        let document = await this.auctionCollection.findOne(query)
        for (const value of document.participants) {
            if (value === username){
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
        return await this.auctionCollection.updateOne(query, updateDocument);
    }

    async getBestOffer(item){
        const query = { item: item};
        let document = await this.auctionCollection.findOne(query)
        return document.bestOffer;
    }

    async setBestOfferor(item, username){
        const query = { item: item };
        const updateDocument = {
            $set : {"bestOfferor": username}
        };
        return await this.auctionCollection.updateOne(query, updateDocument);
    }

    async getBestOfferor(item){
        const query = { item: item};
        let document = await this.auctionCollection.findOne(query)
        return document.bestOfferor;
    }

    async setImage(item, image){
        const query = { item: item };
        const updateDocument = {
            $set : {"img": image}
        };
        return await this.auctionCollection.updateOne(query, updateDocument);
    }

    async setDefaultImage(item){
        const query = { item: item };
        const updateDocument = {
            $set : {"img": imageHolder.placeholderimage()}
        };
        return await this.auctionCollection.updateOne(query, updateDocument);
    }

    async getUserAuctions(username){
        const query = { name: username };
        let document = await this.userCollection.findOne(query)
        return document.auctions;
    }

    async getUserRole(username){
        const query = { name: username };
        let document = await this.userCollection.findOne(query)
        return document.role;
    }
}

module.exports = DBWrapper;
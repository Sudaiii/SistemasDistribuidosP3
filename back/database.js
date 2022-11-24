const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost/aunt-rich";

//const Users = require('./Users')
const Auctions = require('./Auctions');

class MongoBot {
    constructor() {
        this.client = new MongoClient(uri);
    }
    async init() {
        await this.client.connect();
        console.log('connected');

        this.db = this.client.db("aunt-rich");
        this.Auctions = new Auctions(this.db);
    }
}

module.exports = new MongoBot();

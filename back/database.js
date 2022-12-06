const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017/aunt-rich"
// const uri = "mongodb://192.168.18.221:27017/aunt-rich";
const uri = process.env.DB_CONNECTION;

const DBWrapper = require("./database_wrapper");

class MongoBot {
    constructor() {
        this.client = new MongoClient(uri);
    }
    async init() {
        await this.client.connect();
        console.log('connected');

        this.db = this.client.db("aunt-rich");
        this.dbw = new DBWrapper(this.db);
    }
}

module.exports = new MongoBot();

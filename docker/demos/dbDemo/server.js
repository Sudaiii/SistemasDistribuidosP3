const {MongoClient} = require('mongodb');
const uri = 'mongodb://192.168.18.221:27018/aunt-rich';
const client = new MongoClient(uri);

async function main(){

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        var db = client.db("aunt-rich");
        var  collection = db.collection('auctions');
        collection.insertOne( { item: 'calzones', participants: [], started: false, finished: false, bestOffer: 0, bestOfferor: 0, log:[], guid: 0});
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


main().catch(console.error);
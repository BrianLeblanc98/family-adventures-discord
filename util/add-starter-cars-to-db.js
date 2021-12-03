const { MongoClient } = require('mongodb');
const { mongoUri } = require('../config.json');

mongoClient = new MongoClient(mongoUri);

const a = require('../data/store/cars/325i.json');
const b = require('../data/store/cars/civic.json');
const c = require('../data/store/cars/mustang.json');

async function run() {
    try {
        await mongoClient.connect();
        await mongoClient.db('familyAdventuresDiscordDb').collection('cars').insertOne(a);
        await mongoClient.db('familyAdventuresDiscordDb').collection('cars').insertOne(b);
        await mongoClient.db('familyAdventuresDiscordDb').collection('cars').insertOne(c);
    } finally {
        
    }
}
run()
const { MongoClient } = require('mongodb');
const { mongoUri } = require('../config.json');

mongoClient = new MongoClient(mongoUri);

const cars = require('../data/store/cars/requests.json');

async function run() {
    try {
        await mongoClient.connect();
        for (car in cars.newCars) {
            await mongoClient.db('familyAdventuresDiscordDb').collection('cars').insertOne(car);
        }
    } finally {
        
    }
}
run()
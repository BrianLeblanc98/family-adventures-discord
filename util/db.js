const { MongoClient } = require('mongodb');
const { mongoUri } = require('../config.json');

module.exports = {
    async init() {
        global.mongoClient = new MongoClient(mongoUri);
        global.ongoingRace = false;

        try {
            await mongoClient.connect();
        
            await mongoClient.db('familyAdventuresDiscordDb').command({ping: 1});
            console.log('connected to mongodb')
        } finally {
            
        }
    },
    async addUser(userJson) {
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').insertOne(userJson);
    },
    async getUser(id) {
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne({ 'id': id });
        return userData;
    },
    async getUsersSorted() {
        let usersData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').find().sort({ 'bal': -1 }).toArray();
        return usersData;
    },
	async isInFamily(userData) {
        if (!userData) {
            return false;
        } else {
            return true;
        }
    },
    async hasStarter(userData) {
        return userData.bought_starter;
    },
    async setBal(userData, newBal) {
        
    },
    async addBal(userData, bal) {
        let newBal = userData.bal + bal;
        let userQuery = { 'id': userData.id };
        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
        return newBal;
    },
    async removeBal(userData, bal) {
        let newBal = userData.bal - bal;
        let userQuery = { 'id': userData.id };
        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
        return newBal;
    },
    async getCar(id) {
        let carQuery = { '_id': id };
        let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
        return carData;
    },
    getFullCarName(carData) {
        return `${carData.year} ${carData.manufacturer} ${carData.name}`;
    },
    async getShopCars() {
        
    }
};

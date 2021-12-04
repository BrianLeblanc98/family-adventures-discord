module.exports = {
    async getUser(id) {
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne({ 'id': id });
        return userData;
    },
	async inFamily(userData) {
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
        let userQuery = { 'id': userData.id };
        let update = { $set: { 'bal': newBal } };
        let result = await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
        return result;
    },
    async addBal(userData, bal) {
        this.setBal(userData, userData.bal + bal);
    },
    async removeBal(userData, bal) {
        this.setBal(userData, userData.bal - bal);
    },
    async getCar(id) {

    },
    async getShopCars() {
        
    }
};

// let carsQuery = { 'starter' : { $exists: false } };
// let carsData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').find(carsQuery).sort({ 'cost': 1 });
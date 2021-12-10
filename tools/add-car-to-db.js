const { MongoClient } = require('mongodb');
const readline = require('readline');

// const { mongoUri } = require('../config.json');

async function addCarToDb(carData){
    const mongoClient = new MongoClient(mongoUri);
    
    try {
        await mongoClient.connect();
        
        await listDatabases(mongoClient);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoClient.close();
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let carData = {
    name: '',
    manufacturer: '',
    year: '',
    description: '',
    cost: 0,
    imgUrl: ''
}

rl.question('Manufacturer: ', (manufacturer) => {
    rl.question('Model name: ', (name) => {
        rl.question('Production year: ', (year) => {
            if (!/^\+?\d+$/.test(year)) {
                console.log('invalid year');
                process.exit(1);
            }
            rl.question('Cost: ', (cost) => {
                if (!/^\+?\d+$/.test(cost)) {
                    console.log('invalid cost');
                    process.exit(1);
                }
                rl.question('Image URL: ', (imgUrl) => {
                    rl.question('Description: ', (description) => {
                        carData.name = name;
                        carData.manufacturer = manufacturer;
                        carData.year = parseInt(year);
                        carData.cost = parseInt(cost);
                        carData.imgUrl = imgUrl;
                        carData.description = description;

                        console.log(carData);
                        rl.question('Is the above information correct? [y/n]', (answer) => {
                            if (answer == 'y' || answer == 'Y') {
                                console.log('Adding car to db');
                                // get async working for next line before process.exit();
                                // addCarToDb(carData).catch(console.error);
                                // process.exit(0); 
                            } else if (answer == 'n' || answer == 'N') {
                                console.log(`Car won't be added to db`);
                                process.exit(0);
                            } else {
                                console.log(`Please enter 'y' or 'n'`)
                                process.exit(1);
                            }
                        })
                        process.exit(0);
                    })
                })
            })
        })
    })
});

const { token, mongoUri } = require('./config.json');

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { MongoClient } = require('mongodb');

const client = new Client({ intents: [Intents.FLAGS.GUILDS]});
const mongoClient = new MongoClient(mongoUri);

// Connect to mongo database before connecting to discord
async function mongoConnect() {
    try {
        await mongoClient.connect();
    
        await mongoClient.db('familyAdventuresDiscordDb').command({ping: 1});
        // await mongoClient.db('familyAdventuresDiscordDb').collection('users').insertOne({x: 2})
        console.log('connected to mongodb')
    } finally {
        
    }
}
mongoConnect().catch(console.dir);


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
client.once('ready', () => {
    console.log(`Logged into discord as ${client.user.tag}`);
});

// Command listener
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Button listener
client.on('interactionCreate', async interaction => {
    if(!interaction.isButton()) return;

    interaction.reply(`<@${interaction.user.id}> pressed ${interaction.customId}`);
    // interaction.customId
    // interaction.user.tag
});

client.login(token);

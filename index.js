const { token } = require('./config.json');

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb://10.0.0.101:27017';


const client = new Client({ intents: [Intents.FLAGS.GUILDS]});
const mongoClient = new MongoClient(uri);

// Connect to mongo database before connecting to discord
try {
    await mongoClient.connect();

    await client.db('""').command({ping: 1});
    console.log('connected to mongodb')
} finally {
    await client.close();
}

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

const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the family, get your first car, and get ready to race!'),
	async execute(interaction) {
        if (await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne({'id': interaction.user.id.toString()})){
            await interaction.reply({ content: `You're already part of the family <@${interaction.user.id}>!`, ephemeral: true });
            return;
        }

        let newUser = {
            "id": interaction.user.id,
            "name": interaction.user.username,
            "bought_starter": false,
            "bal": 0,
            "current_car_id": "000",
            "cars": [],
            "items": [],
            "mods": []
        };

        await mongoClient.db('familyAdventuresDiscordDb').collection('users').insertOne(newUser);
        console.log(`${interaction.user.username} added in db`);

        await interaction.reply(`Welcome to the family <@${interaction.user.id}>! Choose your first car with /starter!`);

	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the family, get your first car, and get ready to race!'),
	async execute(interaction) {
        newUser = {
            "id": interaction.user.id,
            "name": interaction.user.name,
            "bal": 0,
            "current_car_id": "000",
            "cars": [],
            "items": [],
            "mods": []
        }
        
        var jsonString = JSON.stringify(newUser);

        // Probably want to async this at some point
        fs.writeFileSync(`./data/users/${interaction.user.id}.json`, jsonString);
        console.log(`${interaction.user.id}.json created`);

		await interaction.reply(`Welcome to the family <@${interaction.user.id}>! You\'ll need a car before you can get yourself some Coronas, which one do you wanna start with?`);
	},
};
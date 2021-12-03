const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Shows your cuurent balance of Coronas, the currency in this family.'),
	async execute(interaction) {
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne({'id': interaction.user.id.toString()})
        if (userData){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        await interaction.reply(`Your current balance is ${userData.bal} Coronas`);
	},
};
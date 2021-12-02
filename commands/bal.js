const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Shows your cuurent balance of Coronas, the currency in this family.'),
	async execute(interaction) {
        // If user isn't in database, tell them to start by using /join
		await interaction.reply('Not implemented yet');
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the family, get your first car, and get ready to race!'),
	async execute(interaction) {
		await interaction.reply('Welcome to the family! You\'ll need a car before you can get your self some coronas, which one do you wanna start with?');
	},
};
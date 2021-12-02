const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display help information for the family'),
	async execute(interaction) {
		await interaction.reply('Get started on this wild family adventure by using /join');
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Do some small work for the family, and get a small amount of Corona in return'),
	async execute(interaction) {
        // actually add some amount of Coronas to users balance
		await interaction.reply('Work done, added 2 Coronas to your balance');
	},
};
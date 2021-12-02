const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the family, get your first car, and get ready to race!'),
	async execute(interaction) {
		await interaction.reply(`Welcome to the family <@${interaction.user.id}>! You\'ll need a car before you can get yourself some coronas, which one do you wanna start with?`);
        console.log(interaction.user.id); // store this somewhere eventually
	},
};
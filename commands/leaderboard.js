const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction) {
        let result = await mongoClient.db('familyAdventuresDiscordDb').collection('users').find().sort({ bal: -1 });
        console.log(result);
		await interaction.reply('');
	},
};
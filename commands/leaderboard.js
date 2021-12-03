const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the family leaderboard'),
	async execute(interaction) {
        let result = await mongoClient.db('familyAdventuresDiscordDb').collection('users').find().sort({ 'bal': -1 }).toArray();
        
        let output = "Current leaderboard";
        for (user of result) {
            output += `${user.name}: ${user.bal}\n`
        }
		await interaction.reply(output);
	},
};
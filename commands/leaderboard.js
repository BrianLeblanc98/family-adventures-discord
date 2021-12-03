const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the family leaderboard'),
	async execute(interaction) {
        let result = await mongoClient.db('familyAdventuresDiscordDb').collection('users').find().sort({ 'bal': -1 }).toArray();
        
        let output = "Current leaderboard\n";
        for (user of result) {
            output += `${user.name}: ${user.bal}\n`
        }
		//await interaction.reply(output);

        const exampleEmbed = new MessageEmbed()
            .setTitle('Leaderboard')
            .addFields(
                { name: 'Username', value: 'IAintToxicLulkjlhakjsdfhgjkasdhfkjashdkjasdhfkj\nKataluo', inline: true },
                { name: 'Coronas', value: '50\n10000000000000000000000000000000000000000000', inline: true },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [ exampleEmbed ] });
	},
};
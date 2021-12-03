const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the family leaderboard'),
	async execute(interaction) {
        let result = await mongoClient.db('familyAdventuresDiscordDb').collection('users').find().sort({ 'bal': -1 }).toArray();
        
        let usernames = '';
        let bals = '';
        for (user of result) {
            usernames += `${user.name}\n`;
            bals += `${user.bal}\n`
        }

        const exampleEmbed = new MessageEmbed()
            .setTitle('Leaderboard')
            .addFields(
                { name: 'Username', value: usernames, inline: true },
                { name: 'Coronas', value: bals, inline: true },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [ exampleEmbed ] });
	},
};
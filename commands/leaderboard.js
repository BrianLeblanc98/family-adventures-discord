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
            .setColor('#0099ff')
            .setTitle('Leaderboard')
            .addFields(
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            // .addField('Inline field title', 'Some value here', true)
            .setTimestamp();
        await interaction.reply({ embeds: [ exampleEmbed ] });
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('../util/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the family leaderboard.'),
	async execute(interaction) {
        let usersData = await db.getUsersSorted();
        
        let usernames = '';
        let bals = '';
        for (user of usersData) {
            usernames += `${user.name}\n`;
            bals += `${user.bal}\n`
        }

        // Looks bad on mobile, maybe fix?
        const embed = new MessageEmbed()
            .setTitle('Leaderboard')
            .addFields(
                { name: 'Name', value: usernames, inline: true },
                { name: 'Coronas', value: bals, inline: true },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [ embed ] });
	},
};
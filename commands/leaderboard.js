const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('../util/db');

const NAME = 'leaderboard';
const DESCRIPTION = 'Show the family leaderboard.';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
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
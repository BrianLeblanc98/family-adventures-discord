const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const NAME = 'help';
const DESCRIPTION = 'Display help information for the family.';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
		// TODO: Generate this by using the name and description fields that are exported by each command
		let help = [
			{ name: '/help', value: 'Display help information for the family.' },
			{ name: '/join', value: 'Join the family, get your first car, and get ready to race!' },
			{ name: '/starter', value: 'Choose your starting car. Each new family member only gets to do this once!' },
			{ name: '\u200B', value: '\u200B' },
			{ name: '/work', value: 'Do some small work for the family, and get a small amount of Corona in return.' },
			{ name: '/easy-race', value: 'Make our family proud, and take out some poser who thinks their car is fast.' },
			{ name: '/medium-race', value: 'Make our family proud, and take out some kid with a lightly tuned car.' },
			{ name: '\u200B', value: '\u200B' },
			{ name: '/bal', value: 'Shows your cuurent balance of Coronas, the currency in this family.' },
			{ name: '/shop', value: 'Look at and buy many things from the family shop, using Corona as a currency!' },
			{ name: '/user', value: 'Show the family all your current data.' },
			{ name: '/leaderboard', value: 'Show the family leaderboard.' },
			{ name: '\u200B', value: '\u200B' },
			{ name: '/race', value: 'Set an entry fee, and anyone can join this winner-takes-all family race!' }
		];

		const embed = new MessageEmbed()
            .setTitle('Help')
			.addFields(help)
            .setTimestamp();
		await interaction.reply({ embeds: [ embed ], ephemeral: true});
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display help information for the family.'),
	async execute(interaction) {
		let help = [
			{ name: '/help', value: 'Display help information for the family.' },
			{ name: '/join', value: 'Join the family, get your first car, and get ready to race!' },
			{ name: '/work', value: 'Do some small work for the family, and get a small amount of Corona in return.' },
			{ name: '/race', value: 'Set an entry fee, and anyone can join this winner-takes-all family race!' },
			{ name: '/easy-race', value: 'Make our family proud, and take out some poser who thinks their car is fast.' },
			{ name: '/bal', value: 'Shows your cuurent balance of Coronas, the currency in this family.' },
			{ name: '/leaderboard', value: 'Show the family leaderboard.' },
			{ name: '/starter', value: 'Choose your starting car. Each new family member only gets to do this once!' },
			{ name: '/shop', value: 'Look at and buy many things from the family shop, using Corona as a currency!' },
			{ name: '/user', value: 'Show the family all your current data.' }
		];

		const embed = new MessageEmbed()
            .setTitle('Help')
			.addFields(help)
            .setTimestamp();
		await interaction.reply({ embeds: [ embed ], ephemeral: true});
	},
};
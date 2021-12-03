const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display help information for the family.'),
	async execute(interaction) {
		let help = {
			'/help': 'Display help information for the family.',
			'/join': 'Join the family, get your first car, and get ready to race!',
			'/work': 'Do some small work for the family, and get a small amount of Corona in return.',
			'/easy-race': 'Make our family proud, and take out some poser who thinks their car is fast.',
			'/bal': 'Shows your cuurent balance of Coronas, the currency in this family.',
			'/leaderboard': 'Show the family leaderboard.',
			'/starter': 'Choose your starting car. Each new family member only gets to do this once!',
			'/store': 'Look at and buy many things from the family store, using Corona as a currency!'
		};
		let keys = Object.keys(help);
		let commands = [];
		let descriptions = [];
		for (let key of keys) {
			commands.push(key);
			descriptions.push(help[key]);
		}
		const embed = new MessageEmbed()
            .setTitle('Leaderboard')
            .addFields(
                { name: 'Command', value: commands, inline: true },
                { name: 'Description', value: descriptions, inline: true },
            )
            .setTimestamp();
		await interaction.reply({ embeds: [ embed ], ephemeral: true});
	},
};
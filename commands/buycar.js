const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buycar')
		.setDescription('Buy a car from the family.')
        .addStringOption(option => 
            option.setName('car')
				.setDescription('The car you\'d like to purchase')
				.setRequired(true)
                .addChoices({name: 'carNameA', value: 'carValueA'}, {name: 'carNameB', value: 'carValueB'})),
	async execute(interaction) {
		await interaction.reply('re');
	},
};
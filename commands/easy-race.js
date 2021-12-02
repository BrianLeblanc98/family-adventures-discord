const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('easy-race')
		.setDescription('Make our family proud, and take out some poser who thinks their car is fast.')
        .addIntegerOption(option => 
            option.setName('bet')
                .setDescription('How much you want to bet, you\'ll get 10% of what you bet as winnings.')
                .setRequired(true)),
	async execute(interaction) {
        if (!fs.existsSync(`./data/users/${interaction.user.id}.json`)){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        let bet = interaction.options.getInteger('bet');
        
		await interaction.reply(`bet was ${bet}`);
	},
};
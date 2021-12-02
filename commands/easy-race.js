const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('easy-race')
		.setDescription('Make our family proud, and take out some poser who thinks their car is fast. Bet however much you want, and you\'ll get 10% as prize winnings!')
        .addIntegerOption(option => 
            option.setName('bet')
                .setDescription('How much you want to bet')
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
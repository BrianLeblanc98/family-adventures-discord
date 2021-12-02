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
        let userJson = JSON.parse(fs.readFileSync(`./data/users/${interaction.user.id}.json`));

        if (bet > userJson.bal) {
            await interaction.reply(`Your current balance is ${userJson.bal}, don't try to lie to the family about how much you have!`);
            return;
        }

        if (Math.random() < 0.9) {
            // WIN
            let winnings = Math.floor(bet * 0.1);
            userJson.bal += winnings;

            await interaction.reply(`You won for the family! Congrats on your ${winnings} Corona win!`);
        } else {
            userJson.bal -= bet;
            await interaction.reply(`You lost it for the family. You lose your ${bet} bet `);
        }

        let jsonString = JSON.stringify(userJson);

        // Probably want to async this at some point
        fs.writeFileSync(`./data/users/${interaction.user.id}.json`, jsonString);

		await interaction.reply(`bet was ${bet}`);
	},
};
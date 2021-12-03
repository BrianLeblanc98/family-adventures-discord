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
        let query = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(query);
        if (!userData){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        let bet = interaction.options.getInteger('bet');

        if (bet > userData.bal) {
            await interaction.reply(`Your current balance is ${userData.bal}, don't try to lie to the family about how much you have!`);
            return;
        }

        let newBal;
        if (Math.random() < 0.9) {
            // WIN
            let winnings = Math.floor(bet * 0.5);
            newBal = userData.bal + winnings;

            await interaction.reply(`You won for the family! Congrats on your ${winnings} Corona win!`);
        } else {
            // LOSE
            newBal = userData.bal - bet;
            await interaction.reply(`You lost it for the family. You lose your ${bet} bet `);
        }

        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(query, update);
	},
};
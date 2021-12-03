const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('easy-race')
		.setDescription('Make our family proud, and take out some poser who thinks their car is fast.')
        .addStringOption(option => 
            option.setName('bet')
                .setDescription('How much you want to bet, you\'ll get 50% of what you bet as winnings. You can also bet all')
                .setRequired(true)),
	async execute(interaction) {
        let query = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(query);
        if (!userData){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        if (!userData.bought_starter) {
            await interaction.reply(`You haven't chosen your starter car <@${interaction.user.id}>! Use /starter to get your first car from the family.`);
            return;
        }

        let betString = interaction.options.getString('bet');
        let bet = 0;
        if (betString === 'all') {
            bet = userData.bal;
        } else if (/^\+?\d+$/.test(betString)) {
            // Check if it's a positive integer
            bet = parseInt(betString);
        } else {
            await interaction.reply({ content: "Please enter 'all' or a positive non-decimal number", ephemeral: true});
            return;
        }

        if (bet <= 0 || bet > userData.bal) {
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
            await interaction.reply(`You lost it for the family. You lose your ${bet} Corona bet `);
        }

        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(query, update);
	},
};
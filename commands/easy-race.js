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
        let userQuery = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
        if (!userData){
            await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
            return;
        }

        if (!userData.bought_starter) {
            await interaction.reply({ content: `You haven't chosen your starter car <@${interaction.user.id}>! Use /starter to get your first car from the family.`, ephemeral: true });
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
        let carQuery = { '_id': userData.current_car_id };
        let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
        let carName = `${carData.year} ${carData.manufacturor} ${carData.name}`;
        if (Math.random() < 0.9) {
            // WIN
            let winnings = Math.floor(bet * 0.5);
            newBal = userData.bal + winnings;

            await interaction.reply(`<@${interaction.user.id}> clapped some cheeks with their ${carName}! Congrats on their ${winnings} Corona win!`);
        } else {
            // LOSE
            newBal = userData.bal - bet;
            await interaction.reply(`<@${interaction.user.id}> lost a ${bet} Corona bet in their ${carName}, bringing shame on the family.`);
        }

        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('medium-race')
		.setDescription('Make our family proud, and take out some kid with a lightly tuned car.')
        .addStringOption(option => 
            option.setName('bet')
                .setDescription('How much you want to bet, you\'ll get 50% of what you bet as winnings. Between 100-2500')
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

        let minBet = 100;
        let maxBet = 2500;
        let payoutPercent = 0.50;
        let winPercent = 0.75;

        let betString = interaction.options.getString('bet');
        let bet = 0;
        if (betString === 'all') {
            bet = userData.bal;
        } else if (/^\+?\d+$/.test(betString)) {
            // Check if it's a positive integer
            bet = parseInt(betString);
        } else {
            await interaction.reply({ content: "Please enter 'all' or a positive non-decimal number", ephemeral: true });
            return;
        }

        if (bet < minBet) {
            await interaction.reply({ content: `The minimum bet is ${minBet} Coronas`, ephemeral: true });
            return;
        } else if (bet > userData.bal) {
            await interaction.reply(`Your current balance is ${userData.bal}, don't try to lie to the family about how much you have!`);
            return;
        } else if (bet > maxBet) {
            bet = maxBet;
        }

        let newBal;
        let carQuery = { '_id': userData.current_car_id };
        let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
        let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;
        if (Math.random() < winPercent) {
            // WIN
            let winnings = Math.ceil(bet * payoutPercent);
            newBal = userData.bal + winnings;

            await interaction.reply(`<@${interaction.user.id}> decimated some kid with their ${carName}! Congrats on their ${winnings} Corona win!`);
        } else {
            // LOSE
            newBal = userData.bal - bet;
            await interaction.reply(`<@${interaction.user.id}> lost a ${bet} Corona bet in their ${carName}. It was a close race, but still disappointing.`);
        }

        let update = { $set: { 'bal': newBal } };
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');
const income = require('../util/income.json');

const NAME = 'easy-race';
const DESCRIPTION = 'Make our family proud, and take out some poser who thinks their car is fast.';
const OPTION_DESCRIPTION = `Bet ${income[NAME].minBet}-${income[NAME].maxBet} Coronas, you\'ll get ${income[NAME].payoutPercent * 100}% back if you win.`;

module.exports = {
    name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION)
        .addStringOption(option => 
            option.setName('bet')
                .setDescription(OPTION_DESCRIPTION)
                .setRequired(true)),
	async execute(interaction) {
        let userData = await db.getUser(interaction.user.id.toString());
        let userInFamily = await db.inFamily(userData);
        let userBoughtStarter = await db.hasStarter(userData);

        if (!userInFamily){
            await interaction.reply(replys.notInFamily(interaction));
            return;
        }

        if (!userBoughtStarter) {
            await interaction.reply(replys.notBoughtStarter(interaction));
            return;
        }

        let minBet = 10;
        let maxBet = 250;
        let payoutPercent = 0.20;
        let winPercent = 0.95;

        let betString = interaction.options.getString('bet');
        let bet = 0;
        if (betString === 'all' || betString == 'max') {
            bet = userData.bal;
        } else if (/^\+?\d+$/.test(betString)) {
            // Check if it's a positive integer
            bet = parseInt(betString);
        } else {
            await interaction.reply(replys.invalidBet());
            return;
        }

        if (bet < income[NAME].minBet) {
            await interaction.reply(replys.underMinBet(income[NAME].minBet));
            return;
        } else if (bet > userData.bal) {
            await interaction.reply(replys.overBalBet(userData.bal, bet));
            return;
        } else if (bet > maxBet) {
            bet = maxBet;
        }

        let newBal;
        let carQuery = { '_id': userData.current_car_id };
        let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
        let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;
        if (Math.random() < income[NAME].winPercent) {
            // WIN
            let winnings = Math.ceil(bet * income[NAME].payoutPercent);
            let newBal = await db.addBal(userData, winnings);

            await interaction.reply(`<@${interaction.user.id}> clapped some cheeks with their ${carName}! Congrats on their ${winnings} Corona win!`);
        } else {
            // LOSE
            let newBal = await db.removeBal(userData, bet);
            await interaction.reply(`<@${interaction.user.id}> lost a ${bet} Corona bet in their ${carName}, bringing shame on the family.`);
        }

        // let update = { $set: { 'bal': newBal } };
        // await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
	},
};
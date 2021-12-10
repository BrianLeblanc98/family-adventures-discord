const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, isInFamily, hasStarter, getCar, getFullCarName, addBal, removeBal } = require('../util/db.js');
const { notInFamily, notBoughtStarter, invalidBet, underMinBet, overBalBet, basicRaceWin, basicRaceLose } = require('../util/replys.js');
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
        await interaction.deferReply();
        let userData = await getUser(interaction.user.id.toString());
        let userInFamily = await isInFamily(userData);

        if (!userInFamily){
            await interaction.editReply(notInFamily(interaction));
            return;
        }

        let userBoughtStarter = await hasStarter(userData);

        if (!userBoughtStarter) {
            await interaction.editReply(notBoughtStarter(interaction));
            return;
        }
        
        let betString = interaction.options.getString('bet');
        let bet = 0;
        if (betString === 'all' || betString == 'max') {
            bet = userData.bal;
        } else if (/^\+?\d+$/.test(betString)) {
            // Check if it's a positive integer
            bet = parseInt(betString);
        } else {
            await interaction.editReply(invalidBet());
            return;
        }

        if (bet < income[NAME].minBet) {
            await interaction.editReply(underMinBet(income[NAME].minBet));
            return;
        } else if (bet > userData.bal) {
            await interaction.editReply(overBalBet(userData.bal, bet));
            return;
        } else if (bet > income[NAME].maxBet) {
            bet = income[NAME].maxBet;
        }

        let carData = await getCar(userData.current_car_id);
        let carName = getFullCarName(carData);
        
        if (Math.random() < income[NAME].winPercent) {
            // WIN
            let winnings = Math.ceil(bet * income[NAME].payoutPercent);
            let newBal = await addBal(userData, winnings);

            await interaction.editReply(basicRaceWin(NAME, interaction, carName, bet, winnings, newBal));
        } else {
            // LOSE
            let newBal = await removeBal(userData, bet);

            await interaction.editReply(basicRaceLose(NAME, interaction, carName, bet, newBal));
        }
	},
};
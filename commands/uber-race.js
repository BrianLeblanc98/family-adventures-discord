const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');
const income = require('../util/income.json');

const NAME = 'uber-race';
const DESCRIPTION = 'Make our family proud, and try to desolate someone.';
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
        let userData = await db.getUser(interaction.user.id.toString());
        let userInFamily = await db.isInFamily(userData);

        if (!userInFamily){
            await interaction.editReply(replys.notInFamily(interaction));
            return;
        }

        let userBoughtStarter = await db.hasStarter(userData);

        if (!userBoughtStarter) {
            await interaction.editReply(replys.notBoughtStarter(interaction));
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
            await interaction.editReply(replys.invalidBet());
            return;
        }

        if (bet < income[NAME].minBet) {
            await interaction.editReply(replys.underMinBet(income[NAME].minBet));
            return;
        } else if (bet > userData.bal) {
            await interaction.editReply(replys.overBalBet(userData.bal, bet));
            return;
        } else if (bet > income[NAME].maxBet) {
            bet = income[NAME].maxBet;
        }

        let carData = await db.getCar(userData.current_car_id);
        let carName = db.getFullCarName(carData);
        
        if (Math.random() < income[NAME].winPercent) {
            // WIN
            let winnings = Math.ceil(bet * income[NAME].payoutPercent);
            let newBal = await db.addBal(userData, winnings);

            await interaction.editReply(replys.basicRaceWin(NAME, interaction, carName, bet, winnings, newBal));
        } else {
            // LOSE
            let newBal = await db.removeBal(userData, bet);

            await interaction.editReply(replys.basicRaceLose(NAME, interaction, carName, bet, newBal));
        }
	},
};
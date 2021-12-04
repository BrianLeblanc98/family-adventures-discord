const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');
const income = require('../util/income.json');

const NAME = 'coinflip';
const DESCRIPTION = 'DOUBLE OR NOTHING FOR THE FAMILY!!!';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
		let userData = await db.getUser(interaction.user.id.toString());
        let userInFamily = await db.inFamily(userData);
        if (!userInFamily) {
            await interaction.reply(replys.notInFamily(interaction));
            return;
        }

        if (userData.bal <= 0) {
            await interaction.reply(replys.underMinBet(1));
            return;
        }

        if (Math.random() < 0.5) {
            let newBal = await db.addBal(userData, userData.bal);
            await interaction.reply(replys.coinflip(true, interaction, newBal));
        } else {
            let newBal = await db.removeBal(userData, userData.bal);
            await interaction.reply(replys.coinflip(false, interaction, newBal));
        }
	},
};
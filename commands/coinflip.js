const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, isInFamily, addBal, removeBal } = require('../util/db.js');
const { notInFamily, underMinBet, coinflip } = require('../util/replys.js');

const NAME = 'coinflip';
const DESCRIPTION = 'DOUBLE OR NOTHING FOR THE FAMILY!!!';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
		let userData = await getUser(interaction.user.id.toString());
        let userInFamily = await isInFamily(userData);
        if (!userInFamily) {
            await interaction.reply(notInFamily(interaction));
            return;
        }

        if (userData.bal <= 0) {
            await interaction.reply(underMinBet(1));
            return;
        }

        if (Math.random() < 0.5) {
            let newBal = await addBal(userData, userData.bal);
            await interaction.reply(coinflip(true, interaction, newBal));
        } else {
            let newBal = await removeBal(userData, userData.bal);
            await interaction.reply(coinflip(false, interaction, newBal));
        }
	},
};
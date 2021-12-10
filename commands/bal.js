const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, isInFamily } = require('../util/db.js');
const { notInFamily, showBal } = require('../util/replys.js');

const NAME = 'bal';
const DESCRIPTION = 'Shows your cuurent balance of Coronas, the currency in this family.';

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

        await interaction.reply(showBal(userData.bal));
	},
};
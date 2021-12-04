const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');

const NAME = 'bal';
const DESCRIPTION = 'Shows your cuurent balance of Coronas, the currency in this family.';

module.exports = {
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

        await interaction.reply(replys.showBal(userData.bal));
	},
};
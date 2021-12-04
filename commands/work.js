const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');
const income = require('../util/income.json');

const NAME = 'work';
const DESCRIPTION = 'Do some small work for the family, and get a small amount of Corona in return.';

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

        let newBal = await db.addBal(userData, income.work.workPay);
		await interaction.reply(replys.workDone(income.work.workPay, newBal));
	},
};

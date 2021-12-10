const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, isInFamily, addBal } = require('../util/db.js');
const { notInFamily, workDone } = require('../util/replys.js');
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
        let userData = await getUser(interaction.user.id.toString());
        let userInFamily = await isInFamily(userData);
        
        if (!userInFamily) {
            await interaction.reply(notInFamily(interaction));
            return;
        }

        let newBal = await addBal(userData, income.work.workPay);
		await interaction.reply(workDone(income.work.workPay, newBal));
	},
};

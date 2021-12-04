const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');

const NAME = 'work';
const DESCRIPTION = 'Do some small work for the family, and get a small amount of Corona in return.';
const WORK_PAY = 5;

module.exports = {
    name: NAME,
    description: DESCRIPTION,
    workPay: WORK_PAY,
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

        let newBal = await db.addBal(userData, this.workPay);
		await interaction.reply(replys.workDone(this.workPay, newBal));
	},
};

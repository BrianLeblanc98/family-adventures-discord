const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');

const NAME = 'work';
const DESCRIPTION = 'Do some small work for the family, and get a small amount of Corona in return.';
const WORK_PAY = 5;

module.exports = {
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
        let userData = await db.getUser(interaction.user.id.toString());
        if (!db.inFamily(userData)) {
            await interaction.reply(replys.notInFamily(interaction));
        }

        let newBal = await db.addBal(userData, WORK_PAY);
		await interaction.reply(replys.workDone(WORK_PAY, newBal));
	},
};

// let userQuery = {'id': interaction.user.id.toString()};
// let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
// if (!userData){
//     await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
//     return;
// }
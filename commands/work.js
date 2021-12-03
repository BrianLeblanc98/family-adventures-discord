const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Do some small work for the family, and get a small amount of Corona in return'),
	async execute(interaction) {
        let query = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(query);
        if (!userData){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        let newBal = userData.bal + 2;
        let update = { $set: { 'bal': newBal } }
        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(query, update)

        // let userJson = JSON.parse(fs.readFileSync(`./data/users/${interaction.user.id}.json`));
        // userJson.bal += 2;

        // let jsonString = JSON.stringify(userJson);

        // // Probably want to async this at some point
        // fs.writeFileSync(`./data/users/${interaction.user.id}.json`, jsonString);

		await interaction.reply(`Work done, added 2 Coronas to your balance. Current balance: ${newBal} Coronas`);
	},
};
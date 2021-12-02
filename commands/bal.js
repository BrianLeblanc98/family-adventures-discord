const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Shows your cuurent balance of Coronas, the currency in this family.'),
	async execute(interaction) {
        if (!fs.existsSync(`./data/users/${interaction.user.id}.json`)){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        let userJson = JSON.parse(fs.readFileSync(`./data/users/${interaction.user.id}.json`));
        await interaction.reply(`Your current balance is ${userJson.bal}`);
	},
};
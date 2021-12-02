const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('Look at and buy many things from the family store!'),
	async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('cars')
                    .setLabel('Cars')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('mods')
                    .setLabel('Mods')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('items')
                    .setLabel('Items')
                    .setStyle('PRIMARY')
            );

		await interaction.reply({ content: "Current balance: {balance eventually}\nWhat do you want to shop for?", components: [row]});
	},
};
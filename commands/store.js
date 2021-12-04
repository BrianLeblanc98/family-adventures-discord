const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('Look at and buy many things from the family store, using Corona as a currency!'),
	async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('shopCars')
                    .setLabel('Cars')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('shopItems')
                    .setLabel('Items')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('shopMods')
                    .setLabel('Mods')
                    .setStyle('')
            );

        const embed = new MessageEmbed()
            .setTitle('Shop')
            .setDescription('What do you want to shop?');

		await interaction.reply({ content: "What do you want to shop for?", embeds: [embed], components: [row], ephemeral: true });

        let message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId == 'shopCars'){
                    let carsQuery = { 'starter': false }
                    let carsData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').find(carsQuery);
                    carsData = await carsData.toArray();
                    console.log(carsData);
                } else if (i.customId == 'shopItems') {
                    await i.reply('Not implemented yet');
                } else if (i.customId == 'shopMods') {
                    await i.reply('Not implemented yet');
                }
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

        collector.on('end', async () => {
            await interaction.editReply({ content: 'Shop timed out', components: [], ephemeral: true });
        });
	},
};
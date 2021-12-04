const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('Browse many things from the family store, using Corona as a currency!'),
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
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId('shopMods')
                    .setLabel('Mods')
                    .setStyle('PRIMARY')
                    .setDisabled(true)
            );

        const embed = new MessageEmbed()
            .setTitle('Shop')
            .setDescription('The family store has everything from cars, random items, and car mods!')
            .setTimestamp();

		await interaction.reply({ content: 'What do you want to shop for?', embeds: [embed], components: [row], ephemeral: true });

        let message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId == 'shopCars'){
                    let carsQuery = { 'starter' : { $exists: false } };
                    let carsData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').find(carsQuery).sort({ 'cost': 1 });
                    carsData = await carsData.toArray();

                    let newDesc = '';
                    let newRowOptions = [];
                    for (carData of carsData) {
                        let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;
                        newDesc += `${carName} -- ${carData.cost} Coronas\n`

                        let optionJson = {
                            label: `${carName} -- ${carData.cost} Coronas`,
                            description: `${carData.description}`,
                            value: `${carData._id}`
                        };
                        newRowOptions.push(optionJson);
                    }

                    let newEmbed = new MessageEmbed()
                        .setTitle('Cars')
                        .setDescription(newDesc)
                        .setTimestamp();

                    const newRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('carToBuy')
                                .setPlaceholder('No car selected')
                                .addOptions(newRowOptions),
                        );
                    await interaction.editReply({ content: 'Here are the cars we have right now:', embeds: [newEmbed], components: [row], ephemeral: true });

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
            await interaction.editReply({ content: 'Shop timed out', embeds: [], components: [], ephemeral: true });
        });
	},
};
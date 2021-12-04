const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message, MessageEmbed, MessageSelectMenu } = require('discord.js');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Browse many things from the family shop, using Corona as a currency!'),
	async execute(interaction) {
        let userQuery = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
        if (!userData){
            await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
            return;
        }

        if (!userData.bought_starter) {
            await interaction.reply({ content: `You haven't chosen your starter car <@${interaction.user.id}>! Use /starter to get your first car from the family.`, ephemeral: true });
            return;
        }

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
            .setDescription('The family shop has everything from cars, random items, and car mods!')
            .setTimestamp();

		await interaction.reply({ content: 'What do you want to shop for?', embeds: [embed], components: [row], ephemeral: true });

        let message = await interaction.fetchReply();
        const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
        const selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 120000});

        buttonCollector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId == 'shopCars'){
                    let carsQuery = { 'starter' : { $exists: false } };
                    let carsData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').find(carsQuery).sort({ 'cost': 1 });
                    carsData = await carsData.toArray();

                    let newDesc = '';
                    let newRowOptions = [];
                    for (let carData of carsData) {
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
                                .setPlaceholder('SELECT AND BUY THE CAR')
                                .addOptions(newRowOptions),
                        );
                    await interaction.editReply({ content: 'Here are the cars we have right now:', embeds: [newEmbed], components: [newRow], ephemeral: true });
                    i.deferUpdate();
                } else if (i.customId == 'shopItems') {
                    await i.reply('Not implemented yet');
                } else if (i.customId == 'shopMods') {
                    await i.reply('Not implemented yet');
                }
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

        buttonCollector.on('end', async () => {
            await interaction.editReply({ content: 'Shop timed out', embeds: [], components: [], ephemeral: true });
        });

        selectMenuCollector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId == 'carToBuy') {
                    let carId = i.values[0];
                    let carQuery = { '_id': new ObjectId(carId) };
                    let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
                    let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;

                    await interaction.deleteReply({ content: 'Shop closed', embeds: [], components: [], ephemeral: true });
                    if (userData.bal < carData.cost) {
                        await i.reply({ content: `You cannot afford the ${carName}`, embeds: [], components: [], ephemeral: true });
                    } else {
                        let newBal = userData.bal - carData.cost;
                        let update = { $set: { 'bal': newBal, 'current_car_id': new ObjectId(carId) }, $push: { 'cars': carData } };
                        await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
                        const embed = new MessageEmbed()
                            .setTitle(`${interaction.user.tag}'s New car`)
                            .setImage(`${carData.imgUrl}`)
                            .setTimestamp();
                        await i.reply({ content: `<@${i.user.id}> just bought a new ${carName}! Check it out:`, embeds: [ embed ] });
                    }
                }
            } else {
                i.reply({ content: `These menus aren't for you!`, ephemeral: true });
            }
        });
	},
};
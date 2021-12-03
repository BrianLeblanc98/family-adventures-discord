const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('starter')
		.setDescription('Choose your starting car. Each new family member only gets to do this once!'),
	async execute(interaction) {
		let userQuery = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
        if (!userData){
            await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
            return;
        }

        if (userData.bought_starter) {
            await interaction.reply({ content: `You've already chosen your starter <@${interaction.user.id}>! Don't think you can get another free car from the family!`, ephemeral: true });
            return;
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('325i')
                    .setLabel('1990 BMW 325i')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('Mustang')
                    .setLabel('1994 Ford Mustang')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('Civic Si')
                    .setLabel('2002 Honda Civic Si')
                    .setStyle('PRIMARY')
                
            );
        
		await interaction.reply({ content: "Which car do you want to start with?", components: [row], ephemeral: true});

        let message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                await interaction.editReply({ content: 'You\'ve made your choice', components: [] });
                let carName;
                if (i.customId == '325i'){
                    carName = '1990 BMW 325i'
                } else if (i.customId == 'Mustang') {
                    carName = '1994 Ford Mustang'
                } else if (i.customId == 'Civic Si') {
                    carName = '2002 Honda Civic Si'
                }

                if (!carName) {
                    i.reply({ content: `Something went wrong, please try again`, ephemeral: true });
                }

                let carQuery = { 'name': carName }
                let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);

                console.log(carData);
                
                i.reply(`<@${i.user.id}> chose the ${carData.name} as their starter car, welcome them to the family!`);

                let update = { $set: {'bought_starter': true, 'current_car_id': carData._id, cars: [carData]} };
                await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(userQuery, update);
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });
	},
};
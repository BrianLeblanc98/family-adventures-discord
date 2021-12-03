const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('starter')
		.setDescription('Choose your starting car. Each new family member only gets to do this once!'),
	async execute(interaction) {
		let query = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(query);
        if (!userData){
            await interaction.reply(`You're not part of the family <@${interaction.user.id}>! Join us by using /join`);
            return;
        }

        if (userData.bought_start) {
            await interaction.reply(`You've already chosen your starter <@${interaction.user.id}>! Don't think you can get another free car from the family!`);
            return;
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('325i')
                    .setLabel('1990 BMW 325i')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('mustang')
                    .setLabel('1994 Ford Mustang')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('civic')
                    .setLabel('2002 Honda Civic Si')
                    .setStyle('PRIMARY')
                
            );
        
		await interaction.reply({ content: "Which car do you want to start with?", components: [row], ephemeral: true});

        let message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                await i.deleteReply();
                i.followUp(`${i.user.id} chose the ${i.label} as their starter car, welcome them to the family!`);
            } else {
                i.followUp({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('race')
		.setDescription('Set an entry fee, and anyone can join this winner-takes-all family race!')
        .addIntegerOption(option =>
            option.setName('entry')
                .setDescription('Set the entry fee for the race')
                .setRequired(true)),
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

        if (ongoingRace) {
            await interaction.reply({ content: `There's a race already going on, wait for it to end before starting another!`, ephemeral: true });
            return;
        }
        ongoingRace = true;

        let entry = interaction.options.getInteger('entry');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('join')
                    .setLabel(`Join Race! (${entry} Coronas)`)
                    .setStyle('PRIMARY')
            )
		await interaction.reply({ content: `<@${interaction.user.id}> Started a family race with an entry of ${entry} Coronas.\nStarts in 15 seconds\n\nEntries:`, components: [row] });

        let entryListIds = [];

        let message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'join') {
                if (entryListIds.includes(i.user.id)) {
                    i.reply({ content: 'You\'ve already joined this race!', ephemeral: true });
                } else {
                    let entrantQuery = {'id': i.user.id.toString()};
                    let entrantData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(entrantQuery);
                    if (!entrantData.bought_starter) {
                        await i.reply({ content: `You haven't chosen your starter car <@${i.user.id}>! Use /starter to get your first car from the family.`, ephemeral: true });
                        return;
                    }

                    if (entrantData.bal < entry) {
                        await i.reply(`Your current balance is ${entrantData.bal}, don't try to lie to the family about how much you have!`);
                        return;
                    }

                    entryListIds.push(i.user.id);

                    let prev = await interaction.fetchReply();
                    await interaction.editReply(prev.content + `\n${i.user.tag}\n`);
                    i.reply({ content: `You've joined ${interaction.user.id}'s race for ${entry} Coronas.`, ephemeral: true });
                }
            }
        });

        collector.on('end', async () => {
            interaction.editReply({ content: `<@${interaction.user.id}>'s ${entry} Corona race is over.`, components: [] });
            ongoingRace = false;
        });
	},
};
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
                    let prev = await interaction.fetchReply();
                    await interaction.editReply(prev.content + `\n${i.user.tag}\n`);
                }
            }
        });

        collector.on('end', async () => {
            interaction.editReply({ content: `<@${interaction.user.id}>'s ${entry} Corona race is over.`, components: [] });
        });
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message, MessageEmbed } = require('discord.js');
const ObjectId = require('mongodb').ObjectId;

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

        let entry = interaction.options.getInteger('entry');
        if (entry <= 0) {
            await interaction.reply({ content: `Entries must be positive!`, ephemeral: true });
            return;
        }

        ongoingRace = true;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('join')
                    .setLabel(`Join Race! (${entry} Coronas)`)
                    .setStyle('PRIMARY')
            )
		await interaction.reply({ content: `<@${interaction.user.id}> Started a family race with an entry of ${entry} Coronas.\nStarts in 10 seconds\n\nEntries:`, components: [row] });

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
                        await i.reply({content: `Your current balance is ${entrantData.bal}, don't try to lie to the family about how much you have!`, ephemeral: true});
                        return;
                    }

                    entryListIds.push(i.user.id);

                    let prev = await interaction.fetchReply();
                    await interaction.editReply(prev.content + `\n${i.user.tag}\n`);
                    i.reply({ content: `You've joined ${interaction.user.tag}'s race for ${entry} Coronas.`, ephemeral: true });
                }
            }
        });

        collector.on('end', async () => {
            await interaction.editReply({ content: `<@${interaction.user.id}>'s ${entry} Corona race is over.`, components: [] });

            let message = '';
            let embed;
            if (entryListIds.length <= 1) {
                message = 'Not enough people showed up, you need at least 2 people to race. The family is disappointed.';
            } else {
                let winnings = entry*entryListIds.length;
                let winnerId = entryListIds[Math.floor(Math.random() * entryListIds.length)];
                let winnerQuery = {'id': winnerId.toString()};
                let winnerData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(winnerQuery);

                let carQuery = { '_id': new ObjectId(winnerData.current_car_id) };
                let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
                let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;

                message = `<@${winnerData.id}> won the ${winnings} Corona pot with their ${carName}! They showed the family who's boss.`;
                embed = new MessageEmbed()
                    .setTitle(`${winnerData.name}'s car`)
                    .setImage(`${carData.imgUrl}`)
                    .setTimestamp();

                let newBal = winnerData.bal + winnings - entry;
                let update = { $set: { 'bal': newBal } };
                await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(winnerQuery, update);

                for (entrantId of entryListIds) {
                    if (entrantId == winnerId) continue;

                    let loserQuery = {'id': entrantId.toString()};
                    let loserData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(loserQuery);

                    newBal = loserData.bal - entry;
                    update = { $set: { 'bal': newBal } };
                    await mongoClient.db('familyAdventuresDiscordDb').collection('users').updateOne(loserQuery, update);
                }
            }

            await interaction.followUp({ content: message, embeds: [embed] } );
            ongoingRace = false;
        });
	},
};
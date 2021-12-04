const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('DOUBLE OR NOTHING FOR THE FAMILY!!!'),
	async execute(interaction) {
		let userQuery = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
        if (!userData){
            await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
            return;
        }

        if (Math.random < 0.5) {
            let winnings = userData.bal;
            newBal = userData.bal + winnings;

            await interaction.reply(`<@${interaction.user.id}> doubled their money! They now have ${newBal}.`);
        } else {
            // LOSE
            newBal = 0;
            await interaction.reply(`<@${interaction.user.id}> lost it all.`);
        }
	},
};
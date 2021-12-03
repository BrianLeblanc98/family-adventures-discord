const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Show the family all your current data.'),
	async execute(interaction) {
		let userQuery = {'id': interaction.user.id.toString()};
        let userData = await mongoClient.db('familyAdventuresDiscordDb').collection('users').findOne(userQuery);
        if (!userData){
            await interaction.reply({ content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true });
            return;
        }

        let carQuery = { '_id': userData.current_car_id };
        let carData = await mongoClient.db('familyAdventuresDiscordDb').collection('cars').findOne(carQuery);
        let carName = `${carData.year} ${carData.manufacturer} ${carData.name}`;

        let userDataFields = [
            { name: 'Current car', value: carName },
            { name: 'Balance of Coronas', value: userData.bal },
        ]

        const embed = new MessageEmbed()
            .setTitle(`${interaction.user.tag}'s data`)
			.addFields(userDataFields)
            .setTimestamp();
		await interaction.reply({ embeds: [ embed ], ephemeral: true});
	},
};
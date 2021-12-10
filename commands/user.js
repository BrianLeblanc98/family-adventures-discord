const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getUser, isInFamily, hasStarter, getCar, getFullCarName } = require('../util/db.js');
const { notInFamily, notBoughtStarter } = require('../util/replys.js');

const NAME = 'user';
const DESCRIPTION = 'Show the family all your current data.';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
		let userData = await getUser(interaction.user.id.toString());
        let userInFamily = await isInFamily(userData);

        if (!userInFamily){
            await interaction.reply(notInFamily(interaction));
            return;
        }

        let userBoughtStarter = await hasStarter(userData);

        if (!userBoughtStarter) {
            await interaction.reply(notBoughtStarter(interaction));
            return;
        }

        let carData = await getCar(userData.current_car_id);
        let carName = getFullCarName(carData);

        let userDataFields = [
            { name: 'Current car', value: carName },
            { name: 'Balance of Coronas', value: `${userData.bal}` },
        ]

        const embed = new MessageEmbed()
            .setTitle(`${interaction.user.tag}'s data`)
            .setImage(`${carData.imgUrl}`)
			.addFields(userDataFields)
            .setTimestamp();
		await interaction.reply({ embeds: [ embed ] });
	},
};
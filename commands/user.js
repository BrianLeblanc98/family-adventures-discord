const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('../util/db.js');
const replys = require('../util/replys.js');

const NAME = 'user';
const DESCRIPTION = 'Show the family all your current data.';

module.exports = {
	name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
		let userData = await db.getUser(interaction.user.id.toString());
        let userInFamily = await db.inFamily(userData);

        if (!userInFamily){
            await interaction.reply(replys.notInFamily(interaction));
            return;
        }

        let userBoughtStarter = await db.hasStarter(userData);

        if (!userBoughtStarter) {
            await interaction.reply(replys.notBoughtStarter(interaction));
            return;
        }

        let carData = await db.getCar(userData.current_car_id);
        let carName = db.getFullCarName(carData);

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
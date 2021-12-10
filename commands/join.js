const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser, isInFamily, addUser } = require('../util/db.js');
const { inFamily, joinedFamily } = require('../util/replys.js');

const NAME = 'join';
const DESCRIPTION = 'Join the family, get your first car, and get ready to race!';

module.exports = {
    name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
        let userData = await getUser(interaction.user.id.toString());
        let userInFamily = await isInFamily(userData);

        if (userInFamily){
            await interaction.reply(inFamily(interaction));
            return;
        }

        let newUser = {
            "id": interaction.user.id,
            "name": interaction.user.username,
            "bought_starter": false,
            "bal": 0,
            "current_car_id": "",
            "cars": [],
            "items": [],
            "mods": []
        };

        await addUser(newUser);
        await interaction.reply(joinedFamily(interaction));
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../util/db.js');
const replys = require('../util/replys.js');

const NAME = 'join';
const DESCRIPTION = 'Join the family, get your first car, and get ready to race!';

module.exports = {
    name: NAME,
    description: DESCRIPTION,
	data: new SlashCommandBuilder()
		.setName(NAME)
		.setDescription(DESCRIPTION),
	async execute(interaction) {
        let userData = await db.getUser(interaction.user.id.toString());
        let userInFamily = await db.inFamily(userData);

        if (userInFamily){
            await interaction.reply(replys.inFamily(interaction));
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

        await db.addUser(newUser);
        await interaction.reply(replys.joinedFamily(interaction));
	},
};
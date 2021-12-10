const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    showBal(bal) {
        return `Your current balance is ${bal} Corona`;
    },
    inFamily(interaction) {
        return { content: `You're already part of the family <@${interaction.user.id}>!`, ephemeral: true };
    },
    notInFamily(interaction) {
        return { content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true };
    },
    joinedFamily(interaction) {
        return `Welcome to the family <@${interaction.user.id}>! Choose your first car with /starter!`;
    },
    hasBoughtStarter(interaction) {
        return { content: `You've already chosen your starter <@${interaction.user.id}>! Don't think you can get another free car from the family!`, ephemeral: true };
    },
    notBoughtStarter(interaciton) {
        return { content: `You haven't chosen your starter car <@${interaciton.user.id}>! Use /starter to get your first car from the family.`, ephemeral: true };
    },
    choosingStarter() {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('325i')
                    .setLabel('1990 BMW 325i')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('Mustang')
                    .setLabel('1994 Ford Mustang')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('Civic Si')
                    .setLabel('2002 Honda Civic Si')
                    .setStyle('PRIMARY')
                
            );
        
        return { content: "Which car do you want to start with?", components: [row], ephemeral: true}
    },
    workDone(workPay, newBal) {
        return `Small family work done, added ${workPay} Corona to your balance. Current balance: ${newBal} Corona`;
    },
    coinflip(win, interaction, newBal) {
        if (win) {
            return `<@${interaction.user.id}> doubled their money!\nThey now have ${newBal} Corona.`;
        } else {
            return `<@${interaction.user.id}> lost it all.\nThey now have ${newBal} Corona.`;
        }
    },
    invalidBet() {
        return { content: "Please enter 'all', 'max', or a positive integer", ephemeral: true };
    },
    underMinBet(minBet) {
        return { content: `The minimum bet is ${minBet} Corona`, ephemeral: true };
    },
    overBalBet(bal, bet) {
        return `Your current balance is ${bal} and you want to bet ${bet}? Don't try to lie to the family about how much you have!`;
    },
    basicRaceWin(raceName, interaction, carName, bet, winnings, newBal) {
        let ending = `\nCongrats on their ${winnings} Corona win! They now have ${newBal} Corona.`;
        if (raceName == 'easy-race') {
            return `<@${interaction.user.id}> won an easy race betting ${bet} Corona!\nThey clapped some cheeks in their ${carName}, showing that the family easily prevails!${ending}`;
        } else if (raceName == 'medium-race') {
            return `<@${interaction.user.id}> won a medium race betting ${bet} Corona!\nThey destroyed some kid in their ${carName}, showing that the family can still fight!${ending}`;
        } else if (raceName == 'hard-race') {
            return `<@${interaction.user.id}> won a hard race betting ${bet} Corona!\nThey annihilated some guy in their ${carName}, showing that the family hits hard!${ending}`;
        } else if (raceName == 'extreme-race') {
            return `<@${interaction.user.id}> won an extreme race betting ${bet} Corona!\nThey decimated some guy in their ${carName}, showing that the family always strikes the hardest!${ending}`;
        } else if (raceName == 'uber-race') {
            return `<@${interaction.user.id}> won an uber race betting ${bet} Corona!\nThey completely desolated some racer in their ${carName}, showing that the family will never hold back!${ending}`;
        }
    },
    basicRaceLose(raceName, interaction, carName, bet, newBal) {
        let ending = `\nThey lost their ${bet} Corona bet. They now have ${newBal} Corona.`;
        if (raceName == 'easy-race') {
            return `<@${interaction.user.id}> lost an easy race betting ${bet} Corona.\nThey got desolated in their ${carName}, bringing incredible shame on the family.${ending}`;
        } else if (raceName == 'medium-race') {
            return `<@${interaction.user.id}> lost a medium race betting ${bet} Corona.\nThey got decimated in their ${carName}, bringing shame on the family.${ending}`;
        } else if (raceName == 'hard-race') {
            return `<@${interaction.user.id}> lost a hard race betting ${bet} Corona.\nThey got annihilated in their ${carName}, bringing some shame on the family.${ending}`;
        } else if (raceName == 'extreme-race') {
            return `<@${interaction.user.id}> lost an extreme race betting ${bet} Corona.\nThey got decimated in their ${carName}, a shame for the family, but it was a tough race.${ending}`;
        } else if (raceName == 'uber-race') {
            return `<@${interaction.user.id}> lost an uber race betting ${bet} Corona.\nThey got completely desolated in their ${carName}, a small shame for the family, but the opponent was very strong.${ending}`;
        }
    },
    somethingWrong() {
        return { content: `Something went wrong, please try again`, ephemeral: true };
    }
}
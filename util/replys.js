module.exports = {
    notInFamily(interaction) {
        return { content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true };
    },
    notBoughtStarter(interaciton) {
        return { content: `You haven't chosen your starter car <@${interaciton.user.id}>! Use /starter to get your first car from the family.`, ephemeral: true };
    },
    workDone(workPay, newBal) {
        return `Small family work done, added ${workPay} Coronas to your balance. Current balance: ${newBal} Coronas`;
    },
    invalidBet() {
        return { content: "Please enter 'all', 'max', or a positive integer", ephemeral: true };
    },
    underMinBet(minBet) {
        return { content: `The minimum bet is ${minBet} Coronas`, ephemeral: true };
    },
    overBalBet(bal, bet) {
        return `Your current balance is ${bal} and you want to bet ${bet}? Don't try to lie to the family about how much you have!`;
    },
    basicRaceWin(raceName, interaction, carName, bet, winnings, newBal) {
        let ending = `\nCongrats on their ${winnings} Corona win! They now have ${newBal} Corona.`;
        if (raceName == 'easy-race') {
            return `<@${interaction.user.id}> won an easy race betting ${bet} Corona!\nThey clapped some cheeks in their ${carName}, showing that the family easily prevails!${ending}`
        } else if (raceName == 'medium-race') {
            return `<@${interaction.user.id}> won a medium race betting ${bet} Corona!\nThey destroyed some kid in their ${carName}, showing that the family can still fight!${ending}`
        }
    },
    basicRaceLose(raceName, interaction, carName, bet, newBal) {
        let ending = `They lost their ${bet} Corona bet. They now have ${newBal} Corona.`;
        if (raceName == 'easy-race') {
            return `<@${interaction.user.id}> lost an easy race betting ${bet} Corona.\nThey got clapped in their ${carName}, bringing incredible shame on the family.${ending}`
        } else if (raceName == 'medium-race') {
            return `<@${interaction.user.id}> lost a medium race betting ${bet} Corona.\nThey got destroyed in their ${carName}, bringing shame on the family.${ending}`
        }
    }
}
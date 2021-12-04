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
    }
}
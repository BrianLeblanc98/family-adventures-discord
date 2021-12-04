module.exports = {
    notInFamily(interaction) {
        return { content: `You're not part of the family <@${interaction.user.id}>! Join us by using /join`, ephemeral: true }
    },
    workDone(workPay, newBal) {
        return `Small family work done, added ${workPay} Coronas to your balance. Current balance: ${newBal} Coronas`;
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("carteira")
        .setDescription("Exibe o saldo da sua conta."),
    async execute(interaction) {
        const user = interaction.user;
        const wallet = await db.get(`carteira_${user.id}`);
        if (wallet === null) wallet = 0;

        const embed = new EmbedBuilder();
        interaction.reply({
            embeds: [embed.setColor('Green').setTitle(`Carteira Monetária`).setDescription(`Seu saldo é de: **${wallet}R$**`)],
            ephemeral: true
        });
    }
}
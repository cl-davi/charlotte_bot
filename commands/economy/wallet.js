const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("carteira")
        .setDescription("Exibe a carteira de um membro")
        .addUserOption(
            (option) => option
                .setName("membro")
                .setDescription("Selecione um membro para ver a carteira")
                .setRequired(false)
        ),
    async execute(interaction) {
        let user = interaction.options.getUser("membro");

        if (!user) user = interaction.user;

        let wallet = await db.get(`carteira_${user.id}`);

        if (wallet === null) wallet = 0;

        const embed = new EmbedBuilder()
            .setColor("#4169E1")
            .setTitle("Carteira");

        if (user.id === interaction.user.id) {
            interaction.reply({
                embeds: [
                    embed
                        .setDescription(`Você possui **${wallet}** moedas em sua carteira`)
                ], ephemeral: true
            });
        } else {
            interaction.reply({
                embeds: [
                    embed
                        .setDescription(`O membro ${user} possui **R$ ${wallet}** moedas na carteira`)
                ], ephemeral: true
            });
        };
    },
};
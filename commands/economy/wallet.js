const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("Exibe a quantia de moedas que você possui")
        .addUserOption(
            option => option.setName("usuario").setDescription("Selecione um usuário para ver a carteira").setRequired(false),
        ),
    async execute(interaction) {
        let user = interaction.options.getUser("usuario");

        if (!user) user = interaction.user;

        let wallet = await db.get(`carteira_${user.id}`);

        if (wallet === null) wallet = 0;

        const embed = new EmbedBuilder().setColor("#DDA0DD").setTitle("Carteira");

        if (user.id === interaction.user.id) {
            interaction.reply({ embeds: [embed.setDescription(`Você possui **${wallet}** moedas em sua carteira`)] });
        } else {
            interaction.reply({ embeds: [embed.setDescription(`O membro ${user} (ID: \`${user.id}\`) possui **r$ ${wallet}** moedas em sua carteira`)] });
        }
    },
};
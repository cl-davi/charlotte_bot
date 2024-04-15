const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Exibe o tempo de resposta do bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const embed = new EmbedBuilder().setTitle('Latência').setColor('#4169E1');

        const sent = await interaction.reply({ content: 'Requisitando...', fetchReply: true, ephemeral: true });
        interaction.editReply({ embeds: [embed.setDescription(`${sent.createdTimestamp - interaction.createdTimestamp}ms!`)] });
    }
};
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().
        setName("ping")
        .setDescription("Exibe a latência do bot"),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Buscando a latência...', fetchReply: true });
        interaction.editReply(`**Latência**: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, { ephemeral: true });
    },
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Exibe o tempo de resposta do bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        const sent = await interaction.reply({
            embeds: [embed.setColor('Yellow').setTitle('Latência do bot').setDescription('Enviando...')],
            fetchReply: true,
            ephemeral: true
        });
        interaction.editReply({ embeds: [embed.setColor('Aqua').setDescription(`**${sent.createdTimestamp - interaction.createdTimestamp}ms**`)] });
    }
}
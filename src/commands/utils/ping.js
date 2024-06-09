const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Exibe o tempo de resposta do bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        const sent = await interaction.reply({ content: 'Requisitando...', fetchReply: true, ephemeral: true });
        interaction.editReply({
            embeds: [embed.setColor('Green').setTitle('Tempo de resposta do App').setDescription(`${sent.createdTimestamp - interaction.createdTimestamp}ms!`)]
        });
    }
}
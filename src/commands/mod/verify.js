const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificação')
        .setDescription('Envia uma solicitação de verificação.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(
            (option) => option
                .setName('canal')
                .setDescription('Selecione o canal para enviar a solicitação de verificação.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal');

        const embed = new EmbedBuilder();

        const sendChannel = channel.send({
            embeds: [embed.setColor('Green').setTitle('Verificação de membro').setDescription('Clique no botão abaixo para verificar sua conta e ter acesso ao servidor.')],
            components: [new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('veriicar').setLabel('Verificar').setStyle(ButtonStyle.Success))]
        });
        if (!sendChannel) {
            return interaction.reply({
                embeds: [embed.setColor('Red').setDescription('Houve um erro ao tentar enviar a solicitação de verificação.')],
                ephemeral: true
            });
        } else {
            interaction.reply({
                embeds: [embed.setColor('Green').setDescription('Solicitação de verificação enviada.')],
                ephemeral: true
            });

        }
    }
}
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificação')
        .setDescription('Envia uma solicitação de verificação.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption((option) => option.setName('canal').setDescription('Selecione o canal para enviar a solicitação de verificação.').setRequired(true)),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        const channel = interaction.options.getChannel('canal');
        try {
            await channel.send({
                embeds: [embed.setColor('Aqua').setTitle('Verificação de membro').setDescription('Clique no botão abaixo para verificar sua conta e ter acesso ao servidor.')],
                components: [new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('verify').setLabel('Verificar').setStyle(ButtonStyle.Success))]
            });
            interaction.reply({
                content: 'Pedido de verificação enviado.',
                ephemeral: true
            });
        } catch (error) {
            console.error(`Houve um erro ao enviar a solicitação de verificação.\n${error}`);
        }
    }
}
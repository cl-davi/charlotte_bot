const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Limpa as mensagens de um canal ou de um usuário específico")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addIntegerOption(
            option => option.setName('quantidade').setDescription("Quantidade de mensagens que deseja apagar").setRequired(true),
        ),
    async execute(interaction) {
        const { channel, options } = interaction;
        const amount = options.getInteger('quantidade');

        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });
        const response = new EmbedBuilder().setColor("#DDA0DD");

        await channel.bulkDelete(amount, true).then(messages => {
            response.setDescription(`${messages.size} mensagens foram deletadas`);
            interaction.reply({ embeds: [response], ephemeral: true });
        });
    },
};
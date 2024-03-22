const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Exibe as informações de um usuário')
        .addUserOption(
            option => option.setName("usuario").setDescription("Selecione um usuário").setRequired(true),
        ),
    async execute(interaction) {
        const { options } = interaction;
        const user = options.getUser("usuario") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder().setColor("LuminousVividPink").setAuthor({ name: tag, iconURL: icon }).addFields(
            { name: "Nome", value: `${user}`, inline: false },
            { name: "Cargos", value: `${member.roles.cache.map(r => r).join(``)}`, inline: false },
            { name: "Data de entrada no servidor", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
            { name: "Data de entrada no Discord", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true },
        ).setFooter({ text: `ID do usuário: ${user.id}` }).setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
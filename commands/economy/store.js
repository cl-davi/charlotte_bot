const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Abre a lojinha de compras'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('**Lojinha do servidor**')
            .setThumbnail('https://i.pinimg.com/originals/fd/79/b9/fd79b98ddf7ff1d071de8a0a79af90bd.gif')
            .setColor('#DDA0DD')
            .setDescription(
                "Sejam bem-vindo(a)s a nossa lojinha! Aqui você encontrará várias ofertas para compra de queijos, morangos e VIP's\n\n"
            ).addFields(
                { name: 'Queijos', value: 'R$ 1.000.00', inline: true },
            ).addFields(
                { name: 'Morangos', value: 'R$ 10.000.00', inline: true },
            ).addFields(
                { name: 'VIP', value: 'R$ 500.00', inline: true },
            ).setTimestamp()

        interaction.reply({ embeds: [embed.setImage('https://i.pinimg.com/564x/6a/1d/9e/6a1d9ed9dbd0145a3c95a7dba827fb02.jpg')] });
    },
};
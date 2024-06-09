const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { economyChannel } = require('../../configuration/app_config.json');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar')
        .setDescription('Executa uma transferência monetária.')
        .addNumberOption(
            (option) => option.setName('quantia').setDescription('Insira o valor a transferir.').setRequired(true),
        ).addUserOption(
            (option) => option.setName('membro').setDescription('Selecione o membro').setRequired(true),
        ),
    async execute(interaction) {
        const amount = interaction.options.getNumber('quantia');
        const member = interaction.options.getUser('membro');

        const channel = interaction.guild.channels.cache.get(economyChannel);
        const avatar = interaction.user.displayAvatarURL({ dynamic: true });
        const wallet = await db.get(`carteira_${user.id}`);

        const embed = new EmbedBuilder();

        if (wallet === null) wallet = 0;

        if (member.id === user.id) {
            return await interaction.reply({
                embeds: [embed.setColor('Yellow').setTitle('Você não pode enviar dinheiro para si mesmo').setDescription('Não vai rolar, espertinho.')],
                ephemeral: true
            });
        }
        if (amount > wallet) {
            return await interaction.reply({
                embeds: [embed.setColor('Yellow').setTitle('O seu saldo é insuficiente').setDescription('Quem tá liso, dorme.')],
                ephemeral: true
            });
        } else {
            await db.add(`carteira_${user.id}`, amount);
            await db.sub(`carteira_${interaction.user.id}`, amount);
            await interaction.reply({ content: 'Transferência realizada.', ephemeral: true });
            await channel.send({ embeds: [embed.setDescription(`**R$${amount}** foram enviados para o membro ${user}.`).setThumbnail(avatar)] });
        }
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar')
        .setDescription('Realiza um pagamento em moedas')
        .addUserOption(
            (option) => option.setName('membro').setDescription('Selecione o membro').setRequired(true),
        ).addNumberOption(
            (option) => option.setName('quantia').setDescription('Quantia que vai enviar').setRequired(true),
        ),
    async execute(interaction) {
        const { options } = interaction;

        const user = options.getUser('membro');
        let amount = options.getNumber('quantia');
        const channel = interaction.guild.channels.cache.get('1229515474799296652');
        const icon = user.displayAvatarURL({ dynamic: true });

        let wallet = await db.get(`carteira_${interaction.user.id}`);

        const embed = new EmbedBuilder()
            .setTitle('Nota Fiscal')
            .setColor('#4169E1');

        if (wallet === null) {
            wallet = 0;
        }
        if (user.id === interaction.user.id) {
            await interaction.reply({
                embeds: [
                    embed.setDescription('Você não pode enviar dinheiro para si mesmo.')
                ],
                ephemeral: true
            });
        }
        if (amount > wallet) {
            await interaction.reply({
                embeds: [
                    embed
                        .setDescription('Saldo insuficiente para realizar a operação de pagamento.')
                ],
                ephemeral: true
            });
        } else {
            await db.add(`carteira_${user.id}`, amount);
            await db.sub(`carteira_${interaction.user.id}`, amount);
            await interaction.reply({ content: 'Quantia enviada com sucesso.', ephemeral: true });
            await channel.send({
                embeds: [
                    embed
                        .setDescription(`O valor de **R$${amount}** foi enviado para ${user}.`)
                        .setThumbnail(icon)
                ]
            });
        };
    },
};
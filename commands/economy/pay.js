const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Realiza um pagamento')
        .addUserOption(
            option => option.setName('usuario').setDescription('Selecione o membro').setRequired(true),
        ).addNumberOption(
            option => option.setName('quantia').setDescription('Quantia que vai enviar').setRequired(true),
        ),
    async execute(interaction) {
        const { options } = interaction;

        let user = options.getUser('usuario');
        let amount = options.getNumber('quantia');

        let wallet = await db.get(`carteira_${interaction.user.id}`);

        if (wallet === null) {
            wallet = 0;
        }
        if (user.id === interaction.user.id) {
            await interaction.reply({ content: 'Você não pode enviar dinheiro para você mesmo.', ephemeral: true });
        }
        if (amount > wallet) {
            await interaction.reply({ content: 'Saldo insuficiente para realizar a operação de pagamento.', ephemeral: true });
        } else {
            await db.add(`carteira_${user.id}`, amount);
            await db.sub(`carteira_${interaction.user.id}`, amount);
            await interaction.reply({ content: `O valor de ${amount} foi enviado para ${user} com sucesso.`, ephemeral: true });
        };
    },
};
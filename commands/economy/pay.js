const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Compra algo da lojinha')
        .addUserOption(
            option => option.setName('usuario').setDescription('Selecione o usuário para efetuar o pagamento').setRequired(true),
        ).addIntegerOption(
            option => option.setName('quantia').setDescription('Insira o valor que vai pagar').setRequired(true),
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('quantia');
        const wallet = db.get(`carteira_${interaction.user.id}`);

        if (amount > wallet) {
            interaction.reply({ content: `**Você não pode executar a transferência pois há apenas \`${wallet}\` moedinhas na sua carteira**`, ephemeral: true });
        } else {
            db.add(`carteira_${user.id}`, amount);
            db.sub(`carteira_${interaction.user.id}`, amount);

            interaction.reply({ content: `**Pagamento de R$\`${amount}\` efetuado com sucesso**`, ephemeral: true });   
        }
    },
};
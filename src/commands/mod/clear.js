const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("limpar")
        .setDescription("Limpa as mensagens de uma canal de texto ou membro específico.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(
            (option) => option
                .setName('quantidade')
                .setDescription("Número de mensagens para limpar.")
                .setMinValue(1)
                .setMaxValue(90)
                .setRequired(true)
        ).addUserOption(
            (option) => option
                .setName('membro')
                .setDescription("Selecione o membro.")
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('quantidade');
        const target = interaction.options.getUser('membro');

        const stringMsg = amount === 1 ? 'mensagem' : 'mensagens';
        const stringMsgEnd = amount === 1 ? 'foi deletada.' : 'foram deletadas.'

        const embed = new EmbedBuilder();

        if (!amount || amount > 90 || amount < 1) {
            return await interaction.reply({
                embeds: [embed.setColor('Yellow').setTitle('Valor fora de alcance').setDescription('Apenas valores entre 1 e 90 são permitidos.')],
                epehemeral: true
            });
        }

        const messagesFromChannel = await interaction.channel.messages.fetch({ limit: amount + 1 });

        if (target) {
            let i = 0;
            const filtered = [];

            (await messagesFromChannel).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            await interaction.channel.bulkDelete(filtered).then(messages => {
                interaction.reply({
                    embeds: [embed.setColor('Green').setTitle('Limpeza concluída').setDescription(`${messages.size} ${stringMsg} de ${target} ${stringMsgEnd}`)],
                    ephemeral: true
                });
            });
        } else {
            await interaction.channel.bulkDelete(amount, true).then(messages => {
                interaction.reply({
                    embeds: [embed.setColor('Green').setTitle('Limpeza concluída').setDescription(`${messages.size} ${stringMsg} ${stringMsgEnd}`)],
                    ephemeral: true
                });
            });
        }
    }
}
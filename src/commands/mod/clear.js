const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apagar')
        .setDescription('Apaga as mensagens do canal de texto ou de um membro específico.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) => option.setName('quantidade').setDescription('Número de mensagens para apagar.').setRequired(true).setMinValue(1).setMaxValue(90))
        .addUserOption((option) => option.setName('membro').setDescription('Selecione o membro.')),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        const amount = interaction.options.getInteger('quantidade');
        const stringMsg = amount === 1 ? 'mensagem' : 'mensagens';
        const stringMsgFim = amount === 1 ? 'foi deletada.' : 'foram deletadas.'
        if (amount < 1 || amount > 90) {
            return interaction.reply({
                embeds: [embed.setColor('Yellow').setTitle('Quantidade extrapolada').setDescription('Apenas quantidades entre 1 e 90 são permitidas.')],
                epehemeral: true
            });
        }

        const target = interaction.options.getUser('membro');

        const messagesChannel = await interaction.channel.messages.fetch({ limit: amount + 1 });

        try {
            if (target) {
                let i = 0;
                const filtered = [];

                (await messagesChannel).filter((msg) => {
                    if (msg.author.id === target.id && amount > i) {
                        filtered.push(msg);
                        i++;
                    }
                });
                await interaction.channel.bulkDelete(filtered).then(messages => {
                    interaction.reply({
                        embeds: [embed.setColor('Aqua').setTitle('Apagado').setDescription(`${messages.size} ${stringMsg} de ${target} ${stringMsgFim}`)],
                        ephemeral: true
                    });
                });
            } else {
                await interaction.channel.bulkDelete(amount, true).then(messages => {
                    interaction.reply({
                        embeds: [embed.setColor('Aqua').setTitle('Apagado').setDescription(`${messages.size} ${stringMsg} ${stringMsgFim}`)],
                        ephemeral: true
                    });
                });
            }
        } catch (error) {
            console.error(`Houve um erro ao apagar as mensagens.\n${error}`);
        }
    }
}
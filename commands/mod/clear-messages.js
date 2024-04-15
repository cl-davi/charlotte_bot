const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("apagar")
        .setDescription("Apaga as mensagens de um canal ou de um usuário em específico")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(
            (option) => option
                .setName('quantidade')
                .setDescription("Quantas mensagens serão apagadas?")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ).addUserOption(
            (option) => option
                .setName('usuario')
                .setDescription("De quem deseja apagar as mensagens?")
        ),
    async execute(interaction) {
        const { options } = interaction;

        let amount = options.getInteger('quantidade');
        const target = options.getUser('usuario');
        const channel = interaction.channel;
        const multiMsg = amount === 1 ? 'message' : 'messages';

        if (!amount || amount > 100 || amount < 1) {
            return await interaction.reply({ content: 'Insira um valor entre 1 e 100', epehemeral: true });
        }

        try {
            const getMessages = await channel.messages.fetch();

            if (getMessages.size === 0) {
                return await interaction.reply({ content: 'Não há mensagens neste canal', ephemeral: true });
            }

            if (amount > getMessages.size) {
                amount = getMessages.size;
            }

            const embed = new EmbedBuilder().setColor("#4169E1");

            await interaction.deferReply({ ephemeral: true });

            let messagesToDelete = [];

            if (target) {
                let i = 0;

                getMessages.forEach((msg) => {
                    if (msg.author.id === target.id && messagesToDelete.length < amount) {
                        messagesToDelete.push(msg);
                        i++;
                    };
                });
                embed.setDescription(`${messagesToDelete.length} ${multiMsg} de ${target} foram deletadas`);
            } else {
                messagesToDelete = getMessages.first(amount);
                embed.setDescription(`${messagesToDelete.length} ${multiMsg} foram deletadas`);
            }

            if (messagesToDelete.length > 0) {
                await channel.bulkDelete(messagesToDelete, true);
            }
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(`${error}`);
            await interaction.followUp({ content: 'Um erro ocorreu enquanto apagava as mensagens', ephemeral: true });
        };
    }
};
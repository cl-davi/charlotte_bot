const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Exibe o perfil de um membro do servidor.')
        .addUserOption((option) => option.setName('membro').setDescription('Selecione o membro').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('membro');

        try {
            const member = await interaction.guild.members.fetch(user.id);
            const userInfo = await user.fetch();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`${user.username}#${user.discriminator}`)
                .setThumbnail(user.avatarURL())
                .addFields(
                    {
                        name: 'ID',
                        value: user.id,
                        inline: true
                    },
                    {
                        name: 'Tag',
                        value: user.tag
                    },
                    {
                        name: 'Conta criada em',
                        value: new Date(user.createdTimestamp).toLocaleDateString('pt-BR'),
                        inline: true
                    },
                    {
                        name: 'Entrou no servidor em',
                        value: new Date(member.joinedTimestamp).toLocaleDateString('pt-BR'),
                        inline: true
                    },
                    {
                        name: 'Cargos',
                        value: member.roles.cache.map((r) => r).join(' | '),
                    },
                ).setImage(userInfo.bannerURL({ dynamic: true, size: 1024 }))
                .setTimestamp();

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
        }
    }
}
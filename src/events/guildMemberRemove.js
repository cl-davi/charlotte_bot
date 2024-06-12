const { Events, EmbedBuilder } = require('discord.js');
const { exit_channel_id } = require('../configurations/guild-config.json');

module.exports = {
    name: Events.GuildMemberRemove,
    execute(interaction) {

        const channel = interaction.guild.channels.cache.get(exit_channel_id);
        const avatar = interaction.user.displayAvatarURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Membro a menos no servidor!')
            .setDescription(`Infelizmente, <@${interaction.id}> saiu do servidor!`)
            .addFields({ name: 'Número de membros:', value: `${interaction.guild.memberCount}` })
            .setTimestamp();

        channel.send({ embeds: [embed.setThumbnail(avatar)] });
    }
}
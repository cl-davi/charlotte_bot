const { Events, EmbedBuilder } = require('discord.js');
const { welcome_channel_id } = require('../configurations/guild-config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    execute(interaction) {        
        const channel = interaction.guild.channels.cache.get(welcome_channel_id);
        const avatar = interaction.user.displayAvatarURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Membro novo no servidor!')
            .setDescription(`Seja bem-vindo(a) ao servidor, <@${interaction.id}>`)
            .addFields({ name: 'Número de membros:', value: `${interaction.guild.memberCount}` })
            .setTimestamp();
        channel.send({ embeds: [embed.setThumbnail(avatar)] });
    }
}
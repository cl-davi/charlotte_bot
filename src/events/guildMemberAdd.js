const { Events, EmbedBuilder } = require('discord.js');
const { welcomeChannel } = require('../configuration/app_config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    execute(interaction) {
        const { guild, user } = interaction;
        
        const channel = guild.channels.cache.get(welcomeChannel);
        const avatar = user.displayAvatarURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Membro novo no servidor!')
            .setDescription(`Seja bem-vindo(a) ao servidor, <@${interaction.id}>`)
            .addFields({ name: 'Número de membros:', value: `${guild.memberCount}` })
            .setTimestamp();

        channel.send({ embeds: [embed.setThumbnail(avatar)] });
    }
}
const { Events, EmbedBuilder } = require('discord.js');
const { exitChannel } = require('../configuration/app_config.json');

module.exports = {
    name: Events.GuildMemberRemove,
    execute(interaction) {
        const { guild, user } = interaction;

        const channel = guild.channels.cache.get(exitChannel);
        const avatar = user.displayAvatarURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Membro a menos no servidor!')
            .setDescription(`Infelizmente, <@${interaction.id}> saiu do servidor!`)
            .addFields({ name: 'Número de membros:', value: `${guild.memberCount}` })
            .setTimestamp();

        channel.send({ embeds: [embed.setThumbnail(avatar)] });
    }
}
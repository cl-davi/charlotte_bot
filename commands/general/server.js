const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildNSFWLevel } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servidor')
        .setDescription('Exibe as informações do servidor'),
    async execute(interaction) {
        const { guild } = interaction;
        const { members, channels, emojis, roles, stickers } = guild;

        const icon = interaction.guild.iconURL({ dynamic: true });
        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter(role => !role.managed);
        const botCount = members.cache.filter(member => member.user.bot).size;

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength) break;

                totalLength += roleString.length + 1;
                result.push(roleString);
            }
            return result.length;
        }
        const splitPascal = (string, separator) => string.split(/(?=[A-U])/).join(separator);

        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

        const totalChannels = getChannelTypeSize([
            ChannelType.GuildText,
            ChannelType.GuildAnnouncement,
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
            ChannelType.GuildForum,
            ChannelType.PublicThread,
            ChannelType.PrivateThread,
            ChannelType.AnnouncementThread,
        ]);

        const embed = new EmbedBuilder()
            .setColor("#4169E1")
            .setTitle(`Informações do servidor - '${guild.name}'`)
            .setThumbnail(icon)
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
                {
                    name: "Descrição",
                    value: `${guild.description || "Nenhum"}`
                },
                {
                    name: "Informações Gerais",
                    value: [
                        `**ID**: ${guild.id}`,
                        `**Tempo de criação**: <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                        `**Proprietário**: <@${guild.ownerId}>`,
                    ].join("\n")
                },
                {
                    name: `Membros (${guild.memberCount})`,
                    value: [
                        `Usuários: ${guild.memberCount - botCount}`,
                        `Bots: ${botCount}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: `\nCargos (${userRoles.length})`,
                    value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join("\n") || "Nenhum"}`,
                    inline: true
                },
                {
                    name: `\nCanais (${totalChannels})`,
                    value: [
                        `Texto: ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                        `voz: ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                    ].join("\n"),
                    inline: true
                },
                {
                    name: `Emojis & Figurinhas (${emojis.cache.size + stickers.cache.size})`,
                    value: [
                        `Animados: ${emojis.cache.filter(emoji => emoji.animated).size}`,
                        `Estáticos: ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                        `Figurinhas: ${stickers.cache.size}`
                    ].join("\n")
                },
                {
                    name: "Nitro",
                    value: [
                        `Nível ${guild.premiumTier || "Nenhum"}`,
                        `Boosters: ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                    ].join("\n")
                },
                {
                    name: "Segurança", value: [
                        `Permissão para NSFW: ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                        `Nível de Verificação: ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                    ].join("\n")
                }
            ).setImage(guild.bannerURL());
        interaction.reply({ embeds: [embed] });
    },
};
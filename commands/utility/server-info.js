const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Exibe informações sobre o servidor')
        .setDMPermission(false),
    async execute(interaction) {
        const { guild } = interaction;
        const { members, channels, emojis, roles, stickers } = guild;

        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
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

        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        
        const totalChannels = getChannelTypeSize([
            ChannelType.GuildText,
            ChannelType.GuildNews,
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
            ChannelType.GuildForum,
            ChannelType.GuildPublicThread,
            ChannelType.GuildPrivateThread,
            ChannelType.GuildNewsThread,
            ChannelType.GuildCategory,
        ]);

        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setTitle(`Informações do servidor ${guild.name}`)
            .setThumbnail(guild.bannerURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
                { name: "Descrição", value: `${guild.description || "Nenhum"}` },
                {
                    name: "Geral", value: [
                        `**Criado em:** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                        `**ID:** ${guild.id}`,
                        `**Dono:** <@${guild.ownerId}>`,
                        `**Idioma:** ${new Intl.DisplayNames(["pt-br"], { type: "language" }).of(guild.preferredLocale)}`,
                    ].join("\n")
                },
                {
                    name: "Recursos", value: guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "Nenhum", inline: true
                },
                {
                    name: "Segurança", value: [
                        `**Filtro Esplícito:** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], "")}`,
                        `**Nível NSFW:** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                        `**Nível de Verificação:** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                    ].join("\n"), inline: true
                },
                {
                    name: `Membro (${guild.memberCount})`,
                    value: [
                        `**Usuário:** ${guild.memberCount - botCount}`,
                        `**Bots:** ${botCount}`
                    ].join("\n"), inline: true
                },
                {
                    name: `Cargos dos usuários (${maxDisplayRoles(userRoles)} of ${userRoles.length})`,
                    value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "Nenhum"}`
                },
                {
                    name: `Cargos dos Bots (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`,
                    value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "Nenhum"}`
                },
                {
                    name: `Canais, Threads e Categorias (${totalChannels})`,
                    value: [
                        `**Canais de Text:** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                        `**Canais de voz:** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                        `**Categories:** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                    ].join("\n"), inline: true
                },
                {
                    name: `Emojis & Figurinhas (${emojis.cache.size + stickers.cache.size})`,
                    value: [
                        `**Animadas:** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                        `**Estáticas:** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                        `**Figurinhas:** ${stickers.cache.size}`
                    ].join("\n"), inline: true
                },
                {
                    name: "Nitro", value: [
                        `**Nível:** ${guild.premiumTier || "Nenhum"}`,
                        `**Boosts:** ${guild.premiumSubscriptionCount}`,
                        `**Boosters:** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                        `**Boosters Totais:** ${guild.members.cache.filter(member => member.roles.premiumSince)}`
                    ].join("\n"), inline: true
                }, { name: "Banner", value: guild.bannerURL() ? "** **" : "keine" }
            );
        interaction.reply({ embeds: [embed] });
    },
};
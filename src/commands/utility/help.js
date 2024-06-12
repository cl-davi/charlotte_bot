const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ajuda').setDescription('Exibe todos os comandos disponibilizado pelo bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        const emojis = { mod: '🛠️', util: '⚙️' };
        const directories = [...new Set(interaction.client.commands.map((cmd) => cmd.folder))];
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || 'Não há uma descrição para este comando.'
                }
            });
            return {
                directory: formatString(dir),
                commands: getCommands
            }
        });

        embed.setColor('Aqua').setTitle('Ajuda com comandos').setDescription('Escolha uma opção no menu de seleção para ver os comandos disponibilizados pelo bot.').setThumbnail("https://img.freepik.com/free-psd/gear-wheel-teamwork-machine-engineering-tools-construction-3d-icon-sign-symbol-mockup-illustration_56104-2212.jpg?t=st=1718078576~exp=1718082176~hmac=1e5a909717e0a1eb6f7425d4490fa5f0a39d862ef5de951f49dca5d220a49912&w=740");

        const components = (state) => [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setPlaceholder('Selecione uma categoria.')
            .setDisabled(state)
            .addOptions(categories.map((cmd) => {
                return {
                    label: cmd.directory,
                    value: cmd.directory.toLowerCase(),
                    description: `Comandos da categoria ${cmd.directory}`,
                    emoji: emojis[cmd.directory.toLowerCase() || null]
                }
            }))
        )];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
            ephemeral: true
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect });
        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find((x) => x.directory.toLowerCase() === directory);

            const embed2 = new EmbedBuilder()
                .setTitle(`Comandos de ${formatString(directory)}`)
                .setDescription(`Lista dos comandos da categoria ${directory}`)
                .addFields(category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true
                    }
                }));
            interaction.update({
                embeds: [embed2]
            });
        });
        collector.on('end', () => {
            initialMessage.edit({ components: components(false) });
        });
    }
}
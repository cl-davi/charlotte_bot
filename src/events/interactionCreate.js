const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Nenhum comando chamado ${interaction.commandName} foi encontrado.`);
            return;
        };

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Ocorreu um erro enquanto este comando estava sendo executado.', ephemeral: true });
                await interaction.reply({ content: 'Ocorreu um erro enquanto este comando estava sendo executado', ephemeral: true });
            };
        };
    },
};
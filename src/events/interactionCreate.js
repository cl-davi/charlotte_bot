const { Events } = require('discord.js');
const { verified_role_id } = require('../configurations/guild-config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    return console.error(`Nenhum comando chamando ${interaction.commandName} foi encontrado.`);
                }
                await command.execute(interaction);
            } else if (interaction.isButton()) {
                const role = interaction.guild.roles.cache.get(verified_role_id);
                await interaction.member.roles.add(role);
                return interaction.reply({
                    content: `Você recebeu o cargo ${role}.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(`Houve um erro na interação do comando.\n${error}`);
        }
    }
}
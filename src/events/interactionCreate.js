const { Events } = require('discord.js');
const { verifiedRole } = require('../configuration/app_config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return console.error(`Nenhum comando chamado ${interaction.commandName} foi encontrado.`);
            }
            command.execute(interaction);
        } else if (interaction.isButton()) {
            const role = interaction.guild.roles.cache.get(verifiedRole);
            return interaction.member.roles.add(role).then((member) => interaction.reply({
                content: `O cargo ${role} foi adicionado a você.`,
                ephemeral: true
            }));
        } else {
            return console.error('Interação indisponível ou não reconhecida.');
        }
    }
}
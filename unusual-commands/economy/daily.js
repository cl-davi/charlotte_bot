const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');

const db = new QuickDB();
const ms = require("ms");

const cooldowns = {};

module.exports = {
    data: new SlashCommandBuilder().setName('moedas').setDescription("Resgate suas moedas diárias"),
    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get('1229515474799296652');

        if (interaction.channel.id !== '1229515474799296652') {
            interaction.reply({ content: `Você só pode utilizar este comando no canal ${channel}`, ephemeral: true });
        } else {
            if (!cooldowns[interaction.user.id]) {
                cooldowns[interaction.user.id] = {
                    lastCmd: null
                };
            };
            let ultCmd = cooldowns[interaction.user.id].lastCmd;
            let timeOut = ms("1 day");

            const embed = new EmbedBuilder()
                .setColor("#4169E1")
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))

            if (ultCmd !== null && timeOut - (Date.now() - ultCmd) > 0) {
                let time = ms(timeOut - (Date.now() - ultCmd));
                let resta = [time.seconds, "segundos"];

                if (resta[0] == 0) {
                    resta = ['alguns', 'milisegundos'];
                };
                if (resta[0] == 1) {
                    resta = [time.seconds, "segundo"];
                };
                interaction.reply(
                    {
                        embeds: [embed.setTitle("Moedas indisponíveis").setDescription(`Espere ${time} para poder resgatar suas moedas novamente!`)],
                        ephemeral: true
                    }
                );
                return;
            } else {
                cooldowns[interaction.user.id].lastCmd = Date.now();
            };
            let quantia = Math.ceil(Math.random() * 100);

            if (quantia < 10) {
                quantia = quantia + 10
            };
            await db.add(`carteira_${interaction.user.id}`, quantia);
            interaction.reply(
                {
                    embeds: [embed.setTitle("Moedas adquiridas com sucesso!").setDescription(`Você resgatou **R$${quantia}** moedas diárias!`)]
                }
            );
        };
    },
};
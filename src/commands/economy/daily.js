const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { economyChannel } = require('../../configuration/app_config.json');
const { QuickDB } = require('quick.db');

const ms = require("ms");

const db = new QuickDB();

const cooldowns = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moedas')
        .setDescription("Resgate suas moedas diárias"),
    async execute(interaction) {
        const { guild, user } = interaction;

        const channel = guild.channels.cache.get(economyChannel);

        const embed = new EmbedBuilder();

        if (channel.id != interaction.channel.id) {
            return interaction.reply({
                embeds: [embed.setColor('Red').setDescription(`Este comando é restrito ao canal de texto: ${channel}`)],
                ephemeral: true
            });
        } else {
            if (!cooldowns[user.id]) {
                cooldowns[user.id] = { lastCmd: null };
            };
            let ultCmd = cooldowns[user.id].lastCmd;
            let timeOut = ms("1 day");
            if (ultCmd !== null && timeOut - (Date.now() - ultCmd) > 0) {
                let time = ms(timeOut - (Date.now() - ultCmd));
                let resta = [time.seconds, "segundos"];
                if (resta[0] == 0) {
                    resta = ['alguns', 'milisegundos'];
                }
                if (resta[0] == 1) {
                    resta = [time.seconds, "segundo"];
                }
                return interaction.reply({
                    embeds: [embed.setColor('Yellow').setTitle("Moedas indisponíveis").setDescription(`Este comando foi utilizado há pouco tempo. Tente novamente em ${time}H`)],
                    ephemeral: true
                });
            } else {
                cooldowns[user.id].lastCmd = Date.now();
            };
            let quantia = Math.ceil(Math.random() * 100);

            if (quantia <= 10) quantia += 10;

            await db.add(`carteira_${interaction.user.id}`, quantia);
            interaction.reply({
                embeds: [embed.setColor('Green').setTitle("Moedas adquiridas").setDescription(`Você resgatou **R$${quantia}** moedas diárias!`)]
            });
        }
    }
}
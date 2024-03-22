const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const ms = require("ms");
const cooldowns = {};

module.exports = {
    data: new SlashCommandBuilder().setName('daily').setDescription("Resgate suas moedinhas diárias"),
    async execute(interaction) {
        if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = { lastCmd: null }; let ultCmd = cooldowns[interaction.user.id].lastCmd;
        let timeOut = ms("1 day");
        const embed = new EmbedBuilder().setColor("LuminousVividPink").setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
        if (ultCmd !== null && timeOut - (Date.now() - ultCmd) > 0) {
            let time = ms(timeOut - (Date.now() - ultCmd)); let resta = [time.seconds, "segundos"];
            if (resta[0] == 0) resta = ['alguns', 'milisegundos']; if (resta[0] == 1) resta = [time.seconds, "segundo"];

            interaction.reply({ embeds: [embed.setTitle("Daily já foi resgatado").setDescription(`Espere \`${time}\` para poder resgatar seu daily novamente!`)], ephemeral: true }); return;
        } else { cooldowns[interaction.user.id].lastCmd = Date.now() };
        let quantia = Math.ceil(Math.random() * 50);
        if (quantia < 0) quantia = quantia + 5;

        await db.add(`carteira_${interaction.user.id}`, quantia);

        interaction.reply({ embeds: [embed.setTitle("Daily já foi resgatado").setDescription(`Você resgatou \`${quantia}\` moedas diárias!`)] });
    },
};
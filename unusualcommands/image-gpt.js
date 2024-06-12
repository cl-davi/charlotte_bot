const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { token } = require('../../configurations/openai-config.json');
const { openai_channel_id } = require('../../configurations/guild-config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: token
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imagem')
        .setDescription('Gera uma imagem com IA.')
        .addStringOption((option) => option.setName('prompt').setDescription('Pesquise sua imagem').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();

        const channel = interaction.guild.channels.cache.get(openai_channel_id);
        const question = interaction.options.getString('prompt');

        if (interaction.channel.id !== channel.id) {
            interaction.editReply({
                embeds: [embed.setColor('Yellow').setDescription(`Este comando só pode ser utilizado no canal: ${channel}`)],
                ephemeral: true
            });
        } else {
            const completion = await openai.images.generate({
                model: 'dall-e-2',
                prompt: question,
                n: 4,
                size: '256x256'
            });
            const response = completion.data[0].url;
            await interaction.editReply({ embeds: [embed.setColor('Green').setImage(response).setTimestamp()] });
        }
    }
}
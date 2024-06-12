const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { token } = require('../../configurations/openai-config.json');
const { openai_channel_id } = require('../../configurations/guild-config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: token
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Faz uma pergunta para a IA.')
        .addStringOption((option) => option.setName('prompt').setDescription('Faça a sua pergunta.').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();

        const channel = interaction.guild.channels.cache.get(openai_channel_id);
        const question = interaction.options.getString('prompt');

        const messages = [{
            role: 'system',
            content: 'Você é um bot desenvolvido para responder qualquer tipo de pergunta sobre qualquer tipo de assunto.'
        },
        {
            role: 'user',
            content: question
        }];
        if (interaction.channel.id !== channel.id) {
            interaction.editReply({
                embeds: [embed.setColor('Yellow').setDescription(`Este comando só pode ser utilizado no canal: ${channel}`)],
                ephemeral: true
            });
        } else {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: messages
            });
            const response = completion.choices[0].message.content;
            await interaction.editReply({ embeds: [embed.setColor('Green').setDescription(response).setTimestamp()] });
        }
    }
}
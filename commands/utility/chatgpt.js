const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { apiKeyOpenai } = require('../../config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI(
    { apiKey: apiKeyOpenai }
);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Faça uma pergunta ao chatgpt')
        .addStringOption(
            (option) => option.setName('prompt').setDescription('Informe a pergunta').setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get('1220368897539051621');
        const question = interaction.options.getString('prompt');

        if (interaction.channel.id !== channel.id) {
            interaction.reply({ content: `Este comando só pode ser utilizado no canal: ${channel}`, ephemeral: true });
        } else {
            await interaction.channel.sendTyping();
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'Você foi programado para responder qualquer tipo de pergunta' },
                    { role: 'user', content: question }
                ]
            });
            const response = completion.choices[0].message.content;

            const embed = new EmbedBuilder()
                .setColor('#DDA0DD')
                .setTitle('ChatGPT')
                .setDescription(`**PERGUNTA**: ${question}\n\n**RESPOSTA**: ${response}`);
            
            interaction.reply({ embeds: [embed.setTimestamp()] });
        }
    },
};
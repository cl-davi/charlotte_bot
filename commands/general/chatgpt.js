const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { apikeyOpenAi } = require('../../config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI(
    { apiKey: apikeyOpenAi }
);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Faz uma pergunta ao chatgpt')
        .addStringOption(
            (option) => option.setName('prompt').setDescription('Informe a pergunta').setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const channel = interaction.guild.channels.cache.get('1228852696036151356');
        const question = interaction.options.getString('prompt');

        const messages = [
            {
                role: 'system',
                content: 'Você é um bot desenvolvido para responder qualquer tipo de pergunta sobre qualquer assunto.'
            },
            {
                role: 'user',
                content: question
            }
        ];

        if (interaction.channel.id !== channel.id) {
            interaction.editReply(
                {
                    content: `Este comando só pode ser utilizado no canal: ${channel}`,
                    ephemeral: true
                }
            );
        } else {
            const embed = new EmbedBuilder();

            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: messages
            });
            const response = completion.choices[0].message.content;
            await interaction.editReply(
                {
                    embeds: [embed.setTitle('ChatGPT').setDescription(`**PERGUNTA**\n${question}\n\n**RESPOSTA**\n${response}`).setColor('Random').setTimestamp()]
                }
            );
        };
    },
};
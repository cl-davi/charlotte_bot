const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Faça uma pergunta ao ChatGPT')
        .addStringOption(
            option => option.setName('prompt').setDescription('Pergunta').setRequired(true),
        ),
    async execute(interaction) {
        const channelId = '1220368897539051621';
        if (interaction.channel.id !== channelId) {
            interaction.reply(`Envie essa mensagem no canal correto: ${channelId}`);
        } else {
            await interaction.reply({ content: `Carregando sua resposta, aguarde um pouco` });

            const { options } = interaction;
            const prompt = options.getString('prompt');

            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto('https://chat-app-f2d296.zapier.app/');

            const textBoxSelector = 'textarea[aria-label="chatbot-user-prompt"]';
            await page.waitForSelector(textBoxSelector);
            await page.type(textBoxSelector, prompt);
            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-testid="final-bot-response"] p');

            let value = await page.$$eval('[data-testid="final-bot-response"]', async (elements) => {
                return elements.map((element) => element.textContent)
            });

            setTimeout(async () => {
                if (value.length = 0) {
                    return await interaction.editReply({ content: `Ocorreu um erro durante a geração de resposta` });
                };
            }, 1000);
            await browser.close();
            value.shift();

            const embed = new EmbedBuilder().setColor('LuminousVividPink').setDescription(`\`\`\`${value.join(`\n\n\n\n`)}\`\`\``);

            await interaction.editReply({ content: '', embeds: [embed] });
        };
    },
};
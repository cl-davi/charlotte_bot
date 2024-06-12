const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./configurations/bot-config.json');

// Criando o client(bot) e definindo suas permissões na propriedade 'intents'.
const client = new Client({
    intents: [Object.keys(GatewayIntentBits)]
});

const fs = require('node:fs');
const path = require('node:path');
const ascii = require('ascii-table');

// Criando o leitor de eventos do bot.
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const tableEvents = new ascii().setHeading('Eventos', 'Status');

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    tableEvents.addRow(file, 'pronto');
}
console.log(tableEvents.toString(), '\nEventos carregados.');

// criando o leitor de comandos do bot.
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const tableCommands = new ascii().setHeading('Comandos', 'Status');

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            const properties = { folder, ...command }
            client.commands.set(command.data.name, properties);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
        tableCommands.addRow(file, 'pronto');
    }
}
console.log(tableCommands.toString(), '\nComandos carregados.');

module.exports = client;

client.login(token);
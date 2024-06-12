const { REST, Routes } = require('discord.js');
const { token, id, server } = require('./configurations/bot-config.json');

const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// Pegando todas as subpastas dentro da pasta 'commands'.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Pegando todos os comandos dentro des subpastas da pasta 'commands'.
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Verificando se os comandos possuem as propriedades 'data' e 'execute'.
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`O comando dentro de ${filePath} não possui a propriedade necessária 'data' ou 'execute'.`);
        }
    }
}

// Construindo e preparando uma instância do módulo REST.
const rest = new REST().setToken(token);

// Fazendo deploy dos comandos.
(async () => {
    try {
        console.log(`Fazendo deploy de ${commands.length} comandos (/)...`);

        // O método 'put()' está sendo usao para carregar todos os coamndos dentro dentro do servidor.
        const data = await rest.put(Routes.applicationGuildCommands(id, server), { body: commands });
        const formatedDataLength = await data.length === 1 ? 'comando foi carregado' : 'comandos foram carregados';
        console.log(`${data.length} ${formatedDataLength} no servidor.`);
    } catch (error) {
        // Pegando os erros de execução, caso o deploy não funcione.
        console.error(error);
    }
})();
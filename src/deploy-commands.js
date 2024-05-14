const { REST, Routes } = require('discord.js');
const { bot_token, clientId, guildId } = require('../src/config.json');

const fs = require('node:fs');
const path = require('node:path');
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
    for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
        if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[AVISO] O comando em '${filePath}' está faltando a propriedade "data" ou "execute".`);
		};
	};
};
const rest = new REST().setToken(bot_token);

(async () => {
	try {
		console.log(`Recarregando ${commands.length} comandos da aplicação (/).`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            },
		);
		console.log(`${data.length} comandos da aplicação foram recarregados.`);
	} catch (error) {
		console.error(`[ERRO]: ${error}`);
	};
})();
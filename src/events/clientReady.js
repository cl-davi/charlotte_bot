const { Events } = require('discord.js');
const { token } = require('../configurations/mongo-config.json');

const mongo = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            await mongo.connect(token);
            console.log('O banco de dados MongoDB está conectado.');
        } catch (error) {
            console.error(`Houve um erro ao conectar o banco de dados MongoDB.\n${error}`);
        }
        console.log(`O bot ${client.user.tag} está online.`);
    }
}
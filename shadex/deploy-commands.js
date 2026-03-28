// ================================================
//   Shadex And Worex INC — Komut Deploy
//   Geliştirici: Cengizhan
// ================================================

const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const { token, clientId, guildId } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`🔄 ${commands.length} komut deploy ediliyor...`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('✅ Komutlar başarıyla deploy edildi!');
    } catch (error) {
        console.error('❌ Deploy hatası:', error);
    }
})();

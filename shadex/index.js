// ================================================
//   Shadex And Worex INC — Moderasyon Botu
//   Geliştirici: Cengizhan
// ================================================

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
    ]
});

// Jail yedek depolama (memory)
client.jailBackup = new Map();

// ── Komutları yükle ───────────────────────────────
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Komut yüklendi: /${command.data.name}`);
    } else {
        console.warn(`⚠️ Eksik komut: ${file}`);
    }
}

// ── Event'leri yükle ─────────────────────────────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ Event yüklendi: ${event.name}`);
}

client.login(token);

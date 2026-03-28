module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`❌ Komut hatası [${interaction.commandName}]:`, error);
            const msg = { content: '❌ Komut çalıştırılırken bir hata oluştu.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(msg);
            } else {
                await interaction.reply(msg);
            }
        }
    }
};

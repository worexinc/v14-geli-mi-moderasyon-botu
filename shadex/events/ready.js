const { branding, developer, jailRoleId } = require('../config.json');
const jailDB = require('../utils/jailDB');

module.exports = {
    name: 'clientReady',
    once: true,

    async execute(client) {
        console.log(`Bot hazir: ${client.user.tag}`);
        console.log(`   ${branding} — Gelistirici: ${developer}`);
        client.user.setActivity(branding, { type: 3 });

        const jailData = jailDB.all();
        let temizlendi = 0;

        for (const [guildId, guild] of client.guilds.cache) {
            for (const [userId, roles] of Object.entries(jailData)) {
                try {
                    const member = await guild.members.fetch(userId).catch(() => null);
                    if (!member) continue;
                    const halaJailRolu = member.roles.cache.has(jailRoleId);
                    if (!halaJailRolu) {
                        await member.roles.set(roles).catch(() => {});
                        jailDB.delete(userId);
                        temizlendi++;
                        console.log(`  Auto-unjail: ${member.user.tag}`);
                    }
                } catch {}
            }
        }

        if (temizlendi > 0) console.log(`  ${temizlendi} üye otomatik unjail edildi.`);
        console.log('Jail kontrol tamamlandi.');
    }
};

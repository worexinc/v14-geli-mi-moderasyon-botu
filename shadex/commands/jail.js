const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const jailDB  = require('../utils/jailDB');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jail')
        .setDescription('Üyenin tüm rollerini çeker, unjail atınca geri verir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(o => o.setName('üye').setDescription("Jail'e atılacak üye").setRequired(true))
        .addStringOption(o => o.setName('sebep').setDescription('Jail sebebi').setRequired(false)),

    async execute(interaction, client) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: 'Bu komutu kullanmak için Staff rolun olması lazım.', flags: 64 });

        await interaction.deferReply();

        const target = interaction.options.getMember('üye');
        const sebep  = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';

        if (jailDB.get(target.id)) return interaction.editReply({ content: `${target} zaten jailde.` });

        // Kaldırılabilir rolleri filtrele
        const kaldirilabilir = target.roles.cache.filter(r =>
            r.id !== interaction.guild.roles.everyone.id &&
            r.managed === false &&
            r.position < interaction.guild.members.me.roles.highest.position
        );

        const mevcutRoller = kaldirilabilir.map(r => r.id);

        // JSON'a kaydet
        jailDB.set(target.id, mevcutRoller);

        // Tüm rolleri tek tek kaldır
        for (const [id, role] of kaldirilabilir) {
            await target.roles.remove(role).catch(() => {});
        }

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('🔒 Jail')
            .addFields(
                { name: '👤 Üye',              value: `${target}`,              inline: true },
                { name: '📝 Sebep',             value: sebep,                    inline: true },
                { name: '🛡 Yetkili',           value: `${interaction.user}`,    inline: true },
                { name: '💾 Çekilen Roller',    value: `${mevcutRoller.length} rol`, inline: true },
            )
            .setFooter({ text: `${branding} • Gelistirici: ${developer}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

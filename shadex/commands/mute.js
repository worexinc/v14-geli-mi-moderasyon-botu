const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Bir üyeyi belirtilen süre boyunca susturur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(o => o.setName('üye').setDescription('Susturulacak üye').setRequired(true))
        .addStringOption(o => o.setName('süre').setDescription('Süre: 10s, 5m, 1h, 2d').setRequired(true))
        .addStringOption(o => o.setName('sebep').setDescription('Susturma sebebi').setRequired(false)),

    async execute(interaction) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: '❌ Bu komutu kullanmak için **Staff** rolün olması lazım.', flags: 64 });
        const target = interaction.options.getMember('üye');
        const süreStr = interaction.options.getString('süre');
        const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';

        const ms = parseDuration(süreStr);
        if (!ms) return interaction.reply({ content: '❌ Geçersiz süre! Örnek: `10s`, `5m`, `1h`, `2d`', flags: 64 });
        if (ms > 28 * 24 * 60 * 60 * 1000) return interaction.reply({ content: '❌ Maksimum süre 28 gündür.', flags: 64 });

        await target.timeout(ms, sebep);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🔇 Üye Susturuldu')
            .addFields(
                { name: '👤 Üye',      value: `${target}`,                inline: true },
                { name: '⏱ Süre',     value: süreStr,                    inline: true },
                { name: '📝 Sebep',    value: sebep,                      inline: true },
                { name: '🛡 Yetkili',  value: `${interaction.user}`,      inline: true },
            )
            .setFooter({ text: `${branding} • Geliştirici: ${developer}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

function parseDuration(str) {
    const match = str.match(/^(\d+)(s|m|h|d)$/i);
    if (!match) return null;
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return parseInt(match[1]) * multipliers[match[2].toLowerCase()];
}

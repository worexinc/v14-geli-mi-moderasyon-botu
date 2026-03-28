const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol-al')
        .setDescription('Bir üyeden rol alır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(o => o.setName('üye').setDescription('Hedef üye').setRequired(true))
        .addRoleOption(o => o.setName('rol').setDescription('Alınacak rol').setRequired(true)),

    async execute(interaction) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: 'Bu komutu kullanmak için Staff rolun olması lazım.', flags: 64 });

        const target = interaction.options.getMember('üye');
        const role   = interaction.options.getRole('rol');

        if (role.managed) return interaction.reply({ content: '❌ Bu rol bir entegrasyon tarafından yönetiliyor.', flags: 64 });
        if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.reply({ content: '❌ Bu rol benden yüksek, değiştirilemez.', flags: 64 });
        if (!target.roles.cache.has(role.id)) return interaction.reply({ content: `❌ ${target} zaten bu role sahip değil.`, flags: 64 });

        await target.roles.remove(role);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('➖ Rol Alındı')
            .addFields(
                { name: '👤 Üye',     value: `${target}`,           inline: true },
                { name: '🏷 Rol',     value: `${role}`,             inline: true },
                { name: '🛡 Yetkili', value: `${interaction.user}`, inline: true },
            )
            .setFooter({ text: `${branding} • Gelistirici: ${developer}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

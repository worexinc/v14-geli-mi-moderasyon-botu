const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Bir üyenin susturmasını kaldırır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(o => o.setName('üye').setDescription('Susturması kaldırılacak üye').setRequired(true)),

    async execute(interaction) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: '❌ Bu komutu kullanmak için **Staff** rolün olması lazım.', flags: 64 });
        const target = interaction.options.getMember('üye');

        await target.timeout(null);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('🔊 Susturma Kaldırıldı')
            .addFields(
                { name: '👤 Üye',     value: `${target}`,           inline: true },
                { name: '🛡 Yetkili', value: `${interaction.user}`, inline: true },
            )
            .setFooter({ text: `${branding} • Geliştirici: ${developer}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

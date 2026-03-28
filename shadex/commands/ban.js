const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir üyeyi sunucudan banlar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(o => o.setName('üye').setDescription('Banlanacak üye').setRequired(true))
        .addStringOption(o => o.setName('sebep').setDescription('Ban sebebi').setRequired(false)),

    async execute(interaction) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: '❌ Bu komutu kullanmak için **Staff** rolün olması lazım.', flags: 64 });
        const target = interaction.options.getMember('üye');
        const sebep  = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';

        await target.ban({ reason: sebep });

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('🔨 Üye Banlandı')
            .addFields(
                { name: '👤 Üye',     value: target.user.tag,       inline: true },
                { name: '📝 Sebep',   value: sebep,                 inline: true },
                { name: '🛡 Yetkili', value: `${interaction.user}`, inline: true },
            )
            .setFooter({ text: `${branding} • Geliştirici: ${developer}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

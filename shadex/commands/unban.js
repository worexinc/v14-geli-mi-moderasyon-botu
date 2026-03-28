const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bir kullanıcının banını kaldırır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(o => o.setName('kullanici-id').setDescription('Banı kaldırılacak kullanıcının ID\'si').setRequired(true)),

    async execute(interaction) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: '❌ Bu komutu kullanmak için **Staff** rolün olması lazım.', flags: 64 });
        const userId = interaction.options.getString('kullanici-id');

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Ban Kaldırıldı')
                .addFields(
                    { name: '🆔 Kullanıcı ID', value: userId,               inline: true },
                    { name: '🛡 Yetkili',       value: `${interaction.user}`, inline: true },
                )
                .setFooter({ text: `${branding} • Geliştirici: ${developer}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch {
            await interaction.reply({ content: '❌ Kullanıcı bulunamadı veya banlı değil.', flags: 64 });
        }
    }
};

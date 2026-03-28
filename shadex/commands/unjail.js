const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const isStaff = require('../utils/staffCheck');
const jailDB  = require('../utils/jailDB');
const { branding, developer } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unjail')
        .setDescription("Üyeye çekilen rolleri geri verir.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(o => o.setName('üye').setDescription("Jail'den çıkarılacak üye").setRequired(true)),

    async execute(interaction, client) {
        if (!isStaff(interaction.member)) return interaction.reply({ content: 'Bu komutu kullanmak için Staff rolun olması lazım.', flags: 64 });

        await interaction.deferReply();

        const target     = interaction.options.getMember('üye');
        const eskiRoller = jailDB.get(target.id);

        if (!eskiRoller) return interaction.editReply({ content: `${target} jail kayıtlarında bulunamadı.` });

        // Eski rolleri teker teker geri ver
        let basarili = 0;
        for (const roleId of eskiRoller) {
            const role = interaction.guild.roles.cache.get(roleId);
            if (!role || role.managed) continue;
            if (role.position >= interaction.guild.members.me.roles.highest.position) continue;
            await target.roles.add(role).catch(() => {});
            basarili++;
        }

        jailDB.delete(target.id);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('🔓 Unjail')
            .addFields(
                { name: '👤 Üye',          value: `${target}`,           inline: true },
                { name: '✅ Geri Verilen', value: `${basarili} rol`,      inline: true },
                { name: '🛡 Yetkili',      value: `${interaction.user}`,  inline: true },
            )
            .setFooter({ text: `${branding} • Gelistirici: ${developer}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

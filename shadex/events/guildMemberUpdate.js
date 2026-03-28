// Bu event artık kullanılmıyor (jail rolü verilmiyor)
// Boş bırakıldı, silebilirsin.
module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(oldMember, newMember, client) {}
};

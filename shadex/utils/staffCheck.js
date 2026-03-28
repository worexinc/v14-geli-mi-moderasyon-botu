const { staffRoleId } = require('../config.json');

/**
 * Üyenin staff rolü veya admin yetkisi var mı kontrol eder.
 */
module.exports = function isStaff(member) {
    return member.roles.cache.has(staffRoleId) || member.permissions.has('Administrator');
};

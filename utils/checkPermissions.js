const CustomError = require('../errors');

const checkPermissions = (reqUser, resUserId) => {
 if (reqUser.role === 'admin') return;
 if (reqUser.userId === resUserId.toString()) return;
 throw new CustomError.UnauthorizedError('No permission');
}

module.exports = checkPermissions;
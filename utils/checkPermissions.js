const CustomError = require('../errors');

const checkPermissions = (reqUser, resUserId) => {
 // console.log(reqUser);
 // console.log(resUserId);
 // console.log(typeof resUserId);
 if (reqUser === 'admin') return;
 if (reqUser.userId === resUserId.toString()) return;
 throw new CustomError.UnauthorizedError('No permission');
}

module.exports = checkPermissions;
const CustomError = require('../errors');
const { isValidToken } = require('../utils');

const authenticateUser = async (req, res, next) => {
 const token = req.signedCookies.token;

 if (!token)
  throw new CustomError.UnauthenticatedError('Authentication failed');

  try {
   const { name, userId, role } = isValidToken({ token });
   req.user = { name, userId, role };
   next();
  } catch (err) {
   throw new CustomError.UnauthenticatedError('Authentication failed');
  }
}

const authorizePermissions = (...roles) => {
 return (req, res, next) => {
  if (!roles.includes(req.user.role))
   throw new CustomError.UnauthorizedError('User has no permission');
  next();
 }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
};
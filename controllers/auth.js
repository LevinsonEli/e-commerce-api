const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createJWT,
  isValidToken,
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils');

const UsersDbController = require('../db/controllers/users');

const register = async (req, res) => {
 const { name, email, password } = req.body;
 const user = await UsersDbController.getInstance().add({
   name,
   email,
   password,
 });

 const tokenUser = createTokenUser(user);
 attachCookiesToResponse({ res, user: tokenUser });

 res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new CustomError.BadRequestError('Email and password must be provided');

  const foundUser = await UsersDbController.getInstance().getByEmail(email);

  const isValidPassword = await foundUser.comparePassword(password);
  if (!isValidPassword)
    throw new CustomError.UnauthenticatedError('Invalid Credentials');

  const tokenUser = { userId: foundUser._id, name: foundUser.name, role: foundUser.role };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
}

const logout = async (req, res) => {
 res.cookie('token', '', {
  httpOnly: true,
  expires: new Date(Date.now())
 });
 res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
 register,
 login,
 logout,
}
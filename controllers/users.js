const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const UsersDbController = require('../db/controllers/users');

const getAll = async (req, res) => {
  const users = await UsersDbController.getAll();
  res.status(StatusCodes.OK).json({ users });
};

const getOne = async (req, res) => {
  const { id: userId } = req.params;
  const user = await UsersDbController.getOne(userId);
  if (!user) throw new CustomError.NotFoundError('User not found');

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const getCurrent = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateOne = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name)
    throw new CustomError.BadRequestError('Email and name must be provided');
  const updatedUser = await UsersDbController.updateOne(req.user.userId, {
    email,
    name,
  });
  const tokenUser = createTokenUser(updatedUser);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ success: true });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword)
    throw new CustomError.BadRequestError(
      'Old and new passwords must be provided'
    );

  const isOldPasswordCorrect = await UsersDbController.isPasswordCorrect(
    userId,
    oldPassword
  );
  if (!isOldPasswordCorrect)
    throw new CustomError.UnauthenticatedError('Invalid credentials');

  await UsersDbController.updatePassword(userId, newPassword);

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAll,
  getCurrent,
  getOne,
  updateOne,
  updatePassword,
};

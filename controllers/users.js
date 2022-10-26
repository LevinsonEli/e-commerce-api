const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const UsersDbController = require('../db/controllers/users');

const getAllUsers = async (req, res) => {
  const users = await UsersDbController.getInstance().getMany();
 res.status(StatusCodes.OK).json({ users });
}

const getUser = async (req, res) => {
 const { id: userId } = req.params;
  const user = await UsersDbController.getInstance().get(userId);
 if (!user)
  throw new CustomError.NotFoundError('User not found');

 checkPermissions(req.user, user._id);
 res.status(StatusCodes.OK).json({ user });
}

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUser = async (req, res) => {
 const { email, name } = req.body;
 if (!email || !name)
  throw new CustomError.BadRequestError('Email and name must be provided');
  const updatedUser = await UsersDbController.getInstance().update(
    {
      _id: req.user.userId,
    },
    { email, name }
  );
 const tokenUser = createTokenUser(updatedUser);
 attachCookiesToResponse({ res, user: tokenUser });

 res.status(StatusCodes.OK).json({ success: true });
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword)
    throw new CustomError.BadRequestError(
      'Old and new passwords must be provided'
    );

  const isOldPasswordCorrect =
    await UsersDbController.getInstance().isPasswordCorrect(
      userId,
      oldPassword
    );
  if (!isOldPasswordCorrect)
    throw new CustomError.UnauthenticatedError('Invalid credentials');

  await UsersDbController.getInstance().update(
    {
      _id: userId,
    },
    { password: newPassword }
  );

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateUserPassword,
};
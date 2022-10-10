const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
 console.log(req.user);
 const users = await User.find({ role: 'user' }).select('-password');
 res.status(StatusCodes.OK).json({ users });
}

const getUser = async (req, res) => {
 const { id: userId } = req.params;
 const user = await User.findOne({ _id: userId }).select('-password');
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
 const updatedUser = await User.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true });
 const tokenUser = createTokenUser(updatedUser);
 attachCookiesToResponse({ res, user: tokenUser });

 res.status(StatusCodes.OK).json({ success: true });
}

const updateUserPassword = async (req, res) => {
 const { oldPassword, newPassword } = req.body;
 if (!oldPassword || !newPassword)
  throw new CustomError.BadRequestError('Old and new passwords must be provided');
 const user = await User.findOne({ _id: req.user.userId });
 const isOldPasswordValid = await user.comparePassword(oldPassword);
 if (!isOldPasswordValid)
  throw new CustomError.UnauthenticatedError('Invalid credentials');
 user.password = newPassword;
 await user.save();
 
 res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateUserPassword,
};
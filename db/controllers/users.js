const User = require('../../models/User');

const getAll = async () => {
  return await User.find({ role: 'user' }).select('-password');
};

const getOne = async (id) => {
  const user = await User.findOne({ _id: id }).select('-password');
  if (!user) throw new CustomError.UnauthenticatedError('User not found');
  return user;
};

const getByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.UnauthenticatedError('Invalid Credentials');
  return user;
};

const create = async (data) => {
  return await User.create(data);
};

const updateOne = async (id, data) => {
  return await User.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

const updatePassword = async (id, newPassword) => {
  const user = await User.findOne({ _id: id });
  user.password = newPassword;
  await user.save();
  return user;
};

const isPasswordCorrect = async (id, password) => {
  const user = await User.findOne({ _id: id });
  return await user.comparePassword(password);
};

module.exports = {
  getAll,
  getOne,
  create,
  getByEmail,
  updateOne,
  updatePassword,
  isPasswordCorrect,
};

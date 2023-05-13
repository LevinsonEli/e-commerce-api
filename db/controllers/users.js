const User= require("../../models/User");

class UsersDbController {
  static #instance;

  static getInstance() {
    if (!this.#instance) 
        this.#instance = new UsersDbController();
    return this.#instance;
  }

  async getMany() {
    return await User.find({ role: 'user' }).select('-password');
  }

  async get(id) {
    const user = await User.findOne({ _id: id }).select('-password');
    if (!user)
      throw new CustomError.UnauthenticatedError('User not found');
    return user;
  }

  async getByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError.UnauthenticatedError('Invalid Credentials');
    return user;
  }

  async add(data) {
    return await User.create(data);
  }

  async update(id, data) {
    return await User.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });
  }

  async updatePassword(id, newPassword) {
    const user = await User.findOne({ _id: id });
    user.password = newPassword;
    await user.save();
    return user;
  }

  async isPasswordCorrect(id, password) {
    const user = await User.findOne({ _id: id });
    return await user.comparePassword(password);
  }

  delete() {

  }
}

module.exports = UsersDbController;
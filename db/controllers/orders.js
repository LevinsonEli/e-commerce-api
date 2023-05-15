const Order = require('../../models/Order');
const CustomError = require('../../errors');

const getAll = async () => {
  return await Order.find({});
};

const getAllByUser = async (userId) => {
  return await Order.find({ user: userId });
};

const getOne = async (id) => {
  const order = await Order.findOne({ _id: id });
  if (!order) throw new CustomError.NotFoundError('Order not found');

  return order;
};

const create = async (data) => {
  return await Order.create(data);
};

const pay = async (id, paymentIndentId) => {
  return await Order.findOneAndUpdate(
    { _id: id },
    {
      paymentIndentId,
      status: 'paid',
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  getAll,
  getAllByUser,
  getOne,
  create,
  pay,
}
const Order = require('../../models/Order');
const CustomError = require('../../errors');

class OrdersDbController {
  static #instance;

  static getInstance() {
    if (!this.#instance) this.#instance = new OrdersDbController();
    return this.#instance;
  }

  async getMany() {
    return await Order.find({});
  }

  async getManyByUser(userId) {
    return await Order.find({ user: userId });
  }

  async get(id) {
    const order = await Order.findOne({ _id: id });
    if (!order) throw new CustomError.NotFoundError('Order not found');

    return order;
  }

  async add(data) {
    return await Order.create(data);
  }

  async pay(id, paymentIndentId) {
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
  }

  async delete(id) {
  }
}

module.exports = OrdersDbController;

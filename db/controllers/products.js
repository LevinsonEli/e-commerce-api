const Product = require('../../models/Product');
const CustomError = require('../../errors');


class ProductsDbController {
  static #instance;

  static getInstance() {
    if (!this.#instance) this.#instance = new ProductsDbController();
    return this.#instance;
  }

  async getMany() {
    return await Product.find({}).populate('reviews');
  }

  async get(id) {
    const product = await Product.findOne({ _id: id });
    if (!product)
      throw new CustomError.NotFoundError('Product not found');

    return product;
  }

  async add(data) {
    return await Product.create(data);
  }

  async update(id, data) {
    const product = await Product.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
    });
    if (!product) 
      throw new CustomError.NotFoundError('Product not found');

    return product;
  }

  async delete(id) {
    const product = await Product.findOne({ _id: id });
    if (!product) 
      throw new CustomError.NotFoundError('Product not found');
    await product.remove();
    
    return true;
  }
}

module.exports = ProductsDbController;
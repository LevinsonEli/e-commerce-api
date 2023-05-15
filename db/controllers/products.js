const Product = require('../../models/Product');
const CustomError = require('../../errors');


const getAll = async () => {
  return await Product.find({}).populate('reviews');
};

const getOne = async (id) => {
  const product = await Product.findOne({ _id: id });
  if (!product) throw new CustomError.NotFoundError('Product not found');

  return product;
};

const create = async (data) => {
  return await Product.create(data);
};

const updateOne = async (id, data) => {
  const product = await Product.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });

  return product;
};

const deleteOne = async (id) => {
  const product = await Product.findOne({ _id: id });
  if (!product) throw new CustomError.NotFoundError('Product not found');
  await product.remove();

  return true;
};

module.exports = {
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
};
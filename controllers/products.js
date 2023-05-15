const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const ProductsDbController = require('../db/controllers/products');

const create = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await ProductsDbController.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAll = async (req, res) => {
  const products = await ProductsDbController.getAll();
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const product = await ProductsDbController.getOne(id);
  res.status(StatusCodes.OK).json({ product });
};

const updateOne = async (req, res) => {
  const { id } = req.params;
  const product = await ProductsDbController.updateOne(id, req.body);
  res.status(StatusCodes.OK).json({ product });
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  await ProductsDbController.deleteOne(id);
  res.status(StatusCodes.OK).json({ success: true });
};

const uploadImage = async (req, res) => {
  if (!req.files) throw new CustomError.BadRequestError('No file uploaded');
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image'))
    throw new CustomError.BadRequestError('No image uploaded');

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize)
    throw new CustomError.BadRequestError(
      `Image size must be no bigger than ${maxSize} butes`
    );

  const imagePath = path.resolve(
    __dirname,
    '../public/uploads/',
    productImage.name
  );

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: { src: productImage.name } });
};

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  uploadImage,
};

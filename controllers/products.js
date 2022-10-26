const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const ProductsDbController = require('../db/controllers/products');

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await ProductsDbController.getInstance().add(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await ProductsDbController.getInstance().getMany();
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await ProductsDbController.getInstance().get(id);
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  ProductValidator.getInstance().validateUpdateProductInput();
  const product = await ProductsDbController.getInstance().update(id, req.body);
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await ProductsDbController.getInstance().delete(id);
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
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};

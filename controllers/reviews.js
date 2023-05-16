const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  checkPermissions
} = require('../utils');

const ProductsDbController = require('../db/controllers/products');
const ReviewsDbController = require('../db/controllers/reviews');

const create = async (req, res) => {
  const { product: productId } = req.body;
  const product = await ProductsDbController.getOne(productId);
  if (!product)
    throw new CustomError.NotFoundError('Product not found');
  
  const existentReview = await ReviewsDbController.getByCreatorAndProduct(req.user.userId, productId);
  if (existentReview)
    throw new CustomError.BadRequestError('User already submitted review for this product');

  req.body.createdBy = req.user.userId;
  const review = await ReviewsDbController.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
}

const getAll = async (req, res) => {
  const reviews = await ReviewsDbController.getAll();
  res.status(StatusCodes.OK).json({ reviews, count: reviews.count });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const review = await ReviewsDbController.getOne(id);
  res.status(StatusCodes.OK).json({ review });
};

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, title } = req.body;

  const review = await ReviewsDbController.getOne(id);
  if (!review) 
    throw new CustomError.NotFoundError('Review not found');

  checkPermissions(req.user, review.createdBy);
  const updatedReview = await ReviewsDbController.updateOne(id, {
    rating,
    comment,
    title,
  });

  res.status(StatusCodes.OK).json({ updatedReview });
};

const deleteOne = async (req, res) => {
  const { id } = req.params;

  const review = await ReviewsDbController.getOne(id);
  if (!review)
    throw new CustomError.NotFoundError('Review not found');

  checkPermissions(req.user, review.createdBy);
  await ReviewsDbController.deleteOne(id);
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
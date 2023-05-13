const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  checkPermissions
} = require('../utils');

const ProductsDbController = require('../db/controllers/products');
const ReviewsDbController = require('../db/controllers/reviews');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  // const input = new CreateReviewInput(productId, title, description, ...args);
  // ( throw exception on every validation fail )
  // const review = await Review.create(input);
  const product = await ProductsDbController.getInstance().get(productId);
  if (!product)
    throw new CustomError.NotFoundError('Product not found');
  
  const existentReview = await ReviewsDbController.getInstance().getByCreatorAndProduct(req.user.userId, productId);
  if (existentReview)
    throw new CustomError.BadRequestError('User already submitted review for this product');

  req.body.createdBy = req.user.userId;
  console.log(req.body);
  const review = await ReviewsDbController.getInstance().add(req.body);
  res.status(StatusCodes.CREATED).json({ review });
}

const getAllReviews = async (req, res) => {
  const reviews = await ReviewsDbController.getInstance().getMany();
  res.status(StatusCodes.OK).json({ reviews, count: reviews.count });
};

const getReview = async (req, res) => {
  const { id } = req.params;
  const review = await ReviewsDbController.getInstance().get(id);
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, title } = req.body;

  const review = await ReviewsDbController.getInstance().get(id);
  if (!review) 
    throw new CustomError.NotFoundError('Review not found');

  checkPermissions(req.user, review.createdBy);
  const updatedReview = await ReviewsDbController.getInstance().update(id, {
    rating,
    comment,
    title,
  });

  res.status(StatusCodes.OK).json({ updatedReview });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  const review = await ReviewsDbController.getInstance().get(id);
  if (!review)
    throw new CustomError.NotFoundError('Review not found');

  // this part does not need to be inside the Input object
  checkPermissions(req.user, review.createdBy);
  await ReviewsDbController.getInstance().delete(id);
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
};
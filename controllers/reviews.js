const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  checkPermissions
} = require('../utils');

const createReview = async (req, res) => {
 const { product: productId } = req.body;
 const product = await Product.findOne({ _id: productId });
 if (!product)
  throw new CustomError.NotFoundError('Product not found');
 
 const existentReview = await Review.findOne({ createdBy: req.user.userId, product: productId });
 if (existentReview)
  throw new CustomError.BadRequestError('User alreadt submitted review for this product');

 req.body.createdBy = req.user.userId;
 const review = await Review.create( req.body );
 res.status(StatusCodes.CREATED).json({ review });
}

const getAllREviews = async (req, res) => {
 const reviews = await Review.find({})
   .populate({ path: 'product', select: 'name company price' });
 res.status(StatusCodes.OK).json({ reviews, count: reviews.count });
};

const getReview = async (req, res) => {
 const { id } = req.params;
 const review = await Review.findOne({ _id: id });
 if (!review)
  throw new CustomError.NotFoundError('Review not found');
 res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
 const { id } = req.params;
 const { rating, comment, title } = req.body;

 const review = await Review.findOne({ _id: id });
 if (!review) 
  throw new CustomError.NotFoundError('Review not found');

 checkPermissions(req.user, review.createdBy);
 review.rating = rating;
 review.title = title;
 review.comment = comment;

 await review.save();
 res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
 const { id } = req.params;

 const review = await Review.findOne({ _id: id });
 if (!review)
  throw new CustomError.NotFoundError('Review not found');

 checkPermissions(req.user, review.createdBy);
 await review.remove();
 res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  createReview,
  getAllREviews,
  getReview,
  updateReview,
  deleteReview,
};
const Review = require('../../models/Review');
const Product = require('../../models/Product');
const CustomError = require('../../errors');

// class ReviewsDbController {
//   static #instance;

//   static getInstance() {
//     if (!this.#instance) this.#instance = new ReviewsDbController();
//     return this.#instance;
//   }

//   async getMany() {
//     return await Review.find({}).populate({
//       path: 'product',
//       select: 'name company price',
//     });
//   }

//   async get(id) {
//     const review = await Review.findOne({ _id: id });
//     if (!review) 
//       throw new CustomError.NotFoundError('Review not found');

//     return review;
//   }

//   async add(data) {
//     return await Review.create(data);
//   }

//   async update(id, data) {
//     const review = await Review.findOneAndUpdate({ _id: id }, data, {
//       new: true,
//       runValidators: true,
//     });
//     // assume that reviw exist
//     if (!review)
//       throw new CustomError.NotFoundError('Review not found');

//     return review;
//   }

//   async delete(id) {
//     await Review.deleteOne({ _id: id });
//     return true;
//   }

//   async getByCreatorAndProduct(userId, productId) {
//     return await Review.findOne({
//       createdBy: userId,
//       product: productId,
//     });
//   }
// }

// module.exports = ReviewsDbController;


const getAll = async () => {
  return await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  });
};

const getOne = async (id) => {
  const review = await Review.findOne({ _id: id });
  if (!review) throw new CustomError.NotFoundError('Review not found');

  return review;
};

const create = async (data) => {
  return await Review.create(data);
};

const updateOne = async (id, data) => {
  const review = await Review.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
  // assume that reviw exist
  if (!review) throw new CustomError.NotFoundError('Review not found');

  return review;
};

const deleteOne = async (id) => {
  await Review.deleteOne({ _id: id });
  return true;
};

const getByCreatorAndProduct = async (userId, productId) => {
  return await Review.findOne({
    createdBy: userId,
    product: productId,
  });
};

module.exports = {
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
  getByCreatorAndProduct,
};
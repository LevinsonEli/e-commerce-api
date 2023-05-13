const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating must be provided'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Title must be provided'],
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Comment must be provided'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must be provided'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product must be provided'],
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdBy: 1 }, { unique: true });

ReviewSchema.statics.calculateRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  const averageRating = result[0]?.averageRating.toFixed(2) || 0;
  const numOfReviews = result[0]?.numOfReviews || 0;
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      { averageRating, numOfReviews }
    );
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateRating(this.product);
});

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
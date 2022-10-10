const mongoose = require('mongoose');
const { defaultConfiguration } = require('../routers/auth');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxLength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxLength: [1000, 'Description cannot be more than 100 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide product company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported as company value',
      },
    },
    colors: {
      type: [String],
      required: [true, 'Please provide product colors'],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value)) return false;
          return value.every((color) => {
            return color.match('^#(?:[0-9a-fA-F]{3}){1,2}$');
          });
        },
        message: 'Please provide an array of colors',
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
    numOfReviews: {
     type: Number,
     default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
 ref: 'Review',
 localField: '_id',
 foreignField: 'product',
 justOne: false,
})

ProductSchema.pre('remove', async function(next) {
 await this.model('Review').deleteMany({ product: this._id });
})

module.exports = mongoose.model('Product', ProductSchema);
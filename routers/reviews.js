const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middleware/authentication');
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

router.route('/')
 .get(getAllReviews)
 .post(authenticateUser, createReview);
router.route('/:id')
  .get(getReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
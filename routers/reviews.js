const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middleware/authentication');
const {
  createReview,
  getAllREviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

router.route('/')
 .get(getAllREviews)
 .post(authenticateUser, createReview);
router.route('/:id')
  .get(getReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
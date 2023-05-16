const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middleware/authentication');
const {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require('../controllers/reviews');

router.route('/')
 .get(getAll)
 .post(authenticateUser, create);
router.route('/:id')
  .get(getOne)
  .patch(authenticateUser, updateOne)
  .delete(authenticateUser, deleteOne);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAll,
  getOne,
  getCurrentUserOrders,
  create,
  pay,
} = require('../controllers/orders');


router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'),  getAll)
  .post(authenticateUser, create);
router.route('/getCurrentUserOrders').get(authenticateUser, getCurrentUserOrders);
router
  .route('/:id')
  .get(authenticateUser, getOne)
  .patch(authenticateUser, pay);

module.exports = router;
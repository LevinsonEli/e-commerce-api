const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllOrders,
  getOrder,
  getCurrentUserOrders,
  createOrder,
  payOrder,
} = require('../controllers/orders');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'),  getAllOrders)
  .post(authenticateUser, createOrder);
router.route('/getCurrentUserOrders').get(authenticateUser, getCurrentUserOrders);
router
  .route('/:id')
  .get(authenticateUser, getOrder)
  .patch(authenticateUser, payOrder);

module.exports = router;
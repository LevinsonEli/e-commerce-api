const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const {
 create,
 getAll,
 getOne,
 updateOne,
 deleteOne,
 uploadImage,
} = require('../controllers/products');


router.route('/')
 .get(getAll)
 .post(authenticateUser, authorizePermissions('admin'), create);
router
  .route('/uploadImage')
  .post(authenticateUser, authorizePermissions('admin'),  uploadImage);
router
  .route('/:id')
  .get(getOne)
  .patch(authenticateUser, authorizePermissions('admin'), updateOne)
  .delete(authenticateUser, authorizePermissions('admin'),  deleteOne);

module.exports = router;
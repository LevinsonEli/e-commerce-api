const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAll,
  getCurrent,
  getOne,
  updateOne,
  updatePassword,
} = require('../controllers/users');

router.get('/', authenticateUser, authorizePermissions('admin'), getAll);
router.get('/showMe', authenticateUser, getCurrent);
router.patch('/updateMe', authenticateUser, updateOne);
router.patch('/updateMyPassword', authenticateUser, updatePassword);
router.get('/:id', authenticateUser, getOne);

module.exports = router;

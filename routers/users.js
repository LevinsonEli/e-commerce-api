const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/users');

router.get('/', authenticateUser, authorizePermissions('admin', 'user'), getAllUsers);
router.get('/showMe', authenticateUser, getCurrentUser);
router.patch('/updateMe', authenticateUser, updateUser);
router.patch('/updateMyPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getUser);

module.exports = router;
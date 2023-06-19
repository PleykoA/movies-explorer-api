const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUserId,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUserById);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;

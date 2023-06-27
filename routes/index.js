const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { NotFoundErrorText } = require('../utils/utils');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');

const { createUser, login, logout } = require('../controllers/users');

router.get('/signout', logout);
router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use(() => {
  throw new NotFoundError(NotFoundErrorText);
});

module.exports = router;

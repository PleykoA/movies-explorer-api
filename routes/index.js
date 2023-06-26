const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use(() => {
  throw new NotFoundError('Ошибка: страница не существует');
});

module.exports = router;

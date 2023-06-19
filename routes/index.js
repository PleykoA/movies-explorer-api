const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use(() => {
  throw new NotFoundError('Ошибка: страница не существует');
});

module.exports = router;

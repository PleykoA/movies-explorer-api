const router = require('express').Router();

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardById, deleteCard);
router.put('/:cardId/likes', validationCardById, likeCard);
router.delete('/:cardId/likes', validationCardById, removeLikeCard);

module.exports = router;

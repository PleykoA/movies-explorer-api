const router = require('express').Router();

const {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../middlewares/validation');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;

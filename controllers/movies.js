const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: _id,
    })
    .then((newMovie) => {
      res.send(newMovie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Ошибка: переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById({ _id: movieId })
    .orFail(() => {
      throw new NotFoundError('Ошибка: фильм не найден');
    })
    .then((movie) => {
      console.log(req.user);
      if (req.user._id === movie.owner.toString()) {
        Movie.findByIdAndRemove(movieId)
          .then(() => res.status(200).send('Фильм удален'))
          .catch((err) => {
            if (err.name === 'CastError') next(new BadRequestError('Ошибка: переданы некорректные данные'));
            else next(err);
          });
      } else {
        throw new ForbiddenError('Ошибка: нельзя удалять чужие фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Ошибка: переданы некорректные данные'));
      else next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

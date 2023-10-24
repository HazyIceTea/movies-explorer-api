const mongoose = require('mongoose');
const http2 = require('http2');
const Movie = require('../models/movie');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorForbidden = require('../errors/ErrorForbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new ErrorNotFound('Фильм не найден'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ErrorForbidden('Нельзя удалть фильм другого пользователя'));
      } else {
        Movie.deleteOne(card)
          .then(() => (card
            ? res.send({ message: 'Фильм успешно удален' })
            : next(new ErrorNotFound('Фильм не найден'))))
          .catch((err) => next(err));
      }
    })
    .catch((err) => (err instanceof mongoose.Error.CastError
      ? next(new ErrorBadRequest('Некорректный Id'))
      : next(err)));
};

module.exports.addMovie = (req, res, next) => {
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

  Movie.create({
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
  })
    .then((movie) => res.status(http2.constants.HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) next(new ErrorBadRequest(err));
      else next(err);
    });
};

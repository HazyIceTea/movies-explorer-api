const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');

const { JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => next(err));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    runValidators: true,
    new: true,
  })
    .orFail(new ErrorNotFound('Пользователь не найден'))
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict('Пользователь с таким Email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new ErrorBadRequest(err.message));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.status(http2.constants.HTTP_STATUS_CREATED).send({
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ErrorConflict('Пользователь с таким Email уже существует'));
          } else if (err instanceof mongoose.Error.ValidationError) {
            next(new ErrorBadRequest(err.message));
          } else next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => next(err));
};

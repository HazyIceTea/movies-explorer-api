const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { emailRegex } = require('../utils/constants');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните поле name'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    required: [true, 'Заполните поле Email'],
    unique: true,
    validate: {
      validator(email) {
        return emailRegex.test(email);
      },
      message: 'Некорректный формат Email',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните поле password'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorUnauthorized('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

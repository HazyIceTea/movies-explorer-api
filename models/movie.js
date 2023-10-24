const mongoose = require('mongoose');
const { urlRegex } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Заполните поле country'],
  },
  director: {
    type: String,
    required: [true, 'Заполните поле director'],
  },
  duration: {
    type: Number,
    required: [true, 'Заполните поле duration'],
  },
  year: {
    type: String,
    required: [true, 'Заполните поле year'],
  },
  description: {
    type: String,
    required: [true, 'Заполните поле description'],
  },
  image: {
    type: String,
    required: [true, 'Заполните поле image'],
    validate: {
      validator(link) {
        return urlRegex.test(link);
      },
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Заполните поле trailerLink'],
    validate: {
      validator(link) {
        return urlRegex.test(link);
      },
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Заполните поле thumbnail'],
    validate: {
      validator(link) {
        return urlRegex.test(link);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Заполните поле owner'],
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: [true, 'Заполните поле movieId'],
  },
  nameRU: {
    type: String,
    required: [true, 'Заполните поле nameRU'],
  },
  nameEN: {
    type: String,
    required: [true, 'Заполните поле nameEN'],
  },

});

module.exports = mongoose.model('movie', movieSchema);

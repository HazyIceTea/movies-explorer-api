const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { createUser, login } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new ErrorNotFound('Страница не найдена')));

module.exports = router;

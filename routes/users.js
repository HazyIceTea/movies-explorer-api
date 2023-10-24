const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { emailRegex } = require('../utils/constants');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().pattern(emailRegex),
  }),
}), updateUserInfo);

module.exports = router;

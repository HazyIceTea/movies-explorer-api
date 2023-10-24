const http2 = require('http2');

const DefaultErrorHandler = ((err, req, res, next) => {
  const { statusCode = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

module.exports = DefaultErrorHandler;

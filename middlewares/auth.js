const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError(`Ошибка авторизации: ${err.message}`));
  }

  req.user = payload;

  return next();
};
module.exports = auth;

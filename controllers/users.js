const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../utils/config');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const checkUser = (user, res) => {
  if (!user) {
    throw new NotFoundError('Ошибка: пользователь не найден');
  }
  return res.send(user);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Ошибка: переданы некорректные данные',
        ));
        console.log(err);
      } else if (err.code === 11000) {
        next(new ConflictError(
          'Ошибка: пользователь с таким email уже существует',
        ));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      checkUser(user, res);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка: переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    )
    .then((user) => {
      checkUser(user, res);
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError('Ошибка: пользователь с таким email уже зарегистрирован'),
        );
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ошибка: пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError('Ошибка: переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Ошибка: пользователь не найден'));
      } else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        config.JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );
      return res.send({ token });
    })
    .catch(next);
};

const logout = (_, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports = {
  logout,
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  getMe,
};

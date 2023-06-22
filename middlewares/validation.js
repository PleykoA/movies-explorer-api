const { celebrate, Joi } = require('celebrate');
/* const isUrl = require('validator/lib/isURL'); */
const BadRequest = require('../errors/BadRequestError');
const { RegExp } = require('../utils/utils');
/* const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Ошибка: некорректный URL');
};
 */
const validationID = (id) => {
  Joi.string().length(24).hex().required();
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw new BadRequest('Ошибка: переданы некорректные данные');
};

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validationID),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object({
    country: Joi.string()
      .messages({
        'any.required': 'Поле "страна" должно быть заполнено',
      })
      .required(),
    director: Joi.string()
      .messages({
        'any.required': 'Поле "режиссер" должно быть заполнено',
      })
      .required(),
    duration: Joi.number()
      .messages({
        'any.required': 'Поле "продолжительность" должно быть заполнено',
      })
      .required(),
    year: Joi.string()
      .messages({
        'any.required': 'Поле "год" должно быть заполнено',
      })
      .required(),
    description: Joi.string()
      .messages({
        'any.required': 'Поле "описание" должно быть заполнено',
      })
      .required(),
    image: Joi.string()
      .regex(RegExp)
      .messages({
        'string.dataUri': 'Некорректная ссылка',
        'any.required': 'Поле "ссылка" должно быть заполнено',
      })
      .required(),
    trailerLink: Joi.string()
      .regex(RegExp)
      .messages({
        'string.dataUri': 'Некорректная ссылка',
      })
      .required(),
    thumbnail: Joi.string()
      .regex(RegExp)
      .messages({
        'string.dataUri': 'Некорректная ссылка',
      })
      .required(),
    nameRU: Joi.string()
      .messages({
        'any.required': 'Поле "название" должно быть заполнено',
      })
      .required(),
    nameEN: Joi.string()
      .messages({
        'any.required': 'Поле "навзвание" должно быть заполнено',
      })
      .required(),
    movieId: Joi.number()
      .messages({
        'any.required': 'Поле "id" должно быть заполнено',
      })
      .required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object({
    _id: Joi.string().hex().length(24)
      .required(),
  }),
});

module.exports = {
  validationDeleteMovie,
  validationCreateMovie,
  validationUserId,
  validationUpdateUser,
  validationCreateUser,
  validationLogin,
};

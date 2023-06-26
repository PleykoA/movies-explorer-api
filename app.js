const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const error = require('./middlewares/error');
const connect = require('./utils/mongo');

const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
connect();
app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);
app.use(auth);

app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT);

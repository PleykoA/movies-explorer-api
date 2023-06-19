const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const error = require('./middlewares/error');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const { createUser, login, logout } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.get('/signout', logout);
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);
app.use(auth);

app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(error);

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log('Connected to database');
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error connecting to database:', err);
    });
    await app.listen(PORT);
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

connect()
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected'));

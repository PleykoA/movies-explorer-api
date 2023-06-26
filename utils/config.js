require('dotenv').config();

const {
  NODE_ENV, PORT, JWT_SECRET, CONNECT,
} = process.env;

const config = {
  PORT: PORT || 3000,
  MONGO_URL: CONNECT || 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
};

module.exports = config;

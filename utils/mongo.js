const mongoose = require('mongoose');
const config = require('./config');

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('Connected to database');
    }).catch((err) => {
      console.error('Error connecting to database:', err);
    });
  } catch (err) {
    console.log(err);
  }
}
connect()
  .then(() => console.log('MongoDB connected'));

module.exports = connect;

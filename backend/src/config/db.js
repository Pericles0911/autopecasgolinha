require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definido no .env");
}

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  logging: false
};

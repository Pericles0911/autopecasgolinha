// backend/src/config/sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL não definido no .env');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true, // created_at / updated_at por padrão
    timestamps: true,
  },
});

module.exports = sequelize;

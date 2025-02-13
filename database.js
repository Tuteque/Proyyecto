const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'pg-juanpacheco-takateke777.b.aivencloud.com',
  port: 25504,
  username: 'avnadmin',
  password: 'AVNS_KAc-duSpj1njhReJ7Ej',
  database: 'defaultdb',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Importante para la conexión segura
    }
  }
});

module.exports = sequelize;

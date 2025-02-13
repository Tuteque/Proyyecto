const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Asegúrate de que la ruta esté correcta


const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,  //Usamos INTEGER para la edad
    allowNull: false
  },
  nacionalidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  //Hacemos que el email sea único
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imagePath: {
    type: DataTypes.STRING,  //Almacenamos la ruta de la imagen
    allowNull: false
  }
}, {
  timestamps: true  //Esto añadirá automáticamente los campos createdAt y updatedAt
});

module.exports = Usuario;

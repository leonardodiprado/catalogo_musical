'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genero extends Model {
    static associate(models) {
      // Define associação com Disco
      Genero.belongsToMany(models.Disco, {
        through: 'DiscoGeneros',
        as: 'discos',
        foreignKey: 'generoId'
      });
    }
  }
  Genero.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genero',
  });
  return Genero;
};

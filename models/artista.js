'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artista extends Model {
    static associate(models) {
      // Define associação com Disco
      Artista.hasMany(models.Disco, {
        foreignKey: 'artistaId',
        as: 'discos'
      });
    }
  }
  Artista.init({
    nome: DataTypes.STRING,
    genero: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artista',
    tableName: 'Artista' // Nome correto da tabela
  });
  return Artista;
};

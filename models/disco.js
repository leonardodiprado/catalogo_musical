'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disco extends Model {
    static associate(models) {
      // Define associação com Artista
      Disco.belongsTo(models.Artista, {
        foreignKey: 'artistaId',
        as: 'artista'
      });
      // Define associação com Genero
      Disco.belongsToMany(models.Genero, {
        through: 'DiscoGeneros',
        as: 'generos',
        foreignKey: 'discoId'
      });
    }
  }
  Disco.init({
    titulo: DataTypes.STRING,
    anoLancamento: DataTypes.INTEGER,
    capa: DataTypes.STRING,
    faixas: DataTypes.JSON,
    artistaId: DataTypes.INTEGER // Adicionar artistaId aqui
  }, {
    sequelize,
    modelName: 'Disco',
  });
  return Disco;
};

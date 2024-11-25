'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Discos', 'artistaId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Artista',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Discos', 'artistaId');
  }
};
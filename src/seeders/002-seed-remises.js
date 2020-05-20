'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Remises', [
      {
        Nom : 'Remise de 5%',
        IsPourcent : 1,
        Valeur : 5
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Remises', null, {});
  }
};

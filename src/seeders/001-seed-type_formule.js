'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Type_Formule', [
        {
            Nom : 'Apéritif'
        },
        {
            Nom : 'Cocktail'
        },
        {
            Nom : 'Box'
        },
        {
            Nom : 'Brunch'
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Type_Formule', null, {});
  }
};

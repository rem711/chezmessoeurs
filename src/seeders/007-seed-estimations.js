'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Estimations', [
        {
            Id_Client : 1,
            Date_Evenement : '2020-03-20 11:00:00',
            Id_Formule_Aperitif : 1,
            Statut : 'Archivé'
        },
        {
            Id_Client : 1,
            Id_Formule_Aperitif : 2,
            Date_Evenement : '2020-03-22 11:00:00',
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Estimations', null, {});
  }
};

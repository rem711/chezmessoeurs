'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Devis', [
        {
            Id_Client : 1,
            Date_Evenement : '2020-03-22 11:00:00',
            Adresse_Livraison : 'adresse livraison apéro client 1',
            Id_Estimation : 1,
            Id_Formule_Aperitif : 2,
            Statut : 'En cours',
            Liste_Options : '8;',
            Prix_HT : 158.4,
            Prix_TTC : 174.24
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Devis', null, {});
  }
};

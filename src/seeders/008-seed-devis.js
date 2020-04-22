'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Devis', [
        {
          Id_Devis : 1,
          Id_Client : 1,
          Date_Evenement : '2020-03-22 11:00:00',
          Adresse_Livraison : 'adresse livraison apéro client 1',
          Id_Estimation : 1,
          Id_Formule_Aperitif : 2,
          Statut : 'En cours',
          Liste_Options : '8;',
          Prix_HT : 158.4,
          Prix_TTC : 174.24
        },
        {
          Id_Devis : 2,
          Id_Client : 5,
          Date_Evenement : '2020-08-27 19:00:00',
          Adresse_Livraison : 'adresse Facturation Client Test',
          Id_Estimation : null,
          Id_Formule_Aperitif : 3,
          Id_Formule_Cocktail : 4,
          Id_Formule_Box : 5,
          Id_Formule_Brunch : 10,
          Statut : 'En cours',
          Liste_Options : null,
          Id_Remise : null,
          Prix_HT : 1016.73,
          Prix_TTC : 1018.4
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Devis', null, {});
  }
};

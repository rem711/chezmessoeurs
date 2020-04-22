'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Estimations', [
        {
          Id_Estimation : 1,
          Id_Client : 1,
          Date_Evenement : '2020-03-20 11:00:00',
          Id_Formule_Aperitif : 1,
          Statut : 'Archivé'
        },
        {
          Id_Estimation : 2,
          Id_Client : 1,
          Id_Formule_Aperitif : 2,
          Date_Evenement : '2020-03-22 11:00:00',
        },
        {
          Id_Estimation : 3,
          Id_Client : 5,
          Id_Formule_Aperitif : 3,
          Date_Evenement : '2020-08-27 19:00:00',
          Commentaire : 'Un produit sans lactose'
        },
        {
          Id_Estimation : 4,
          Id_Client : 5,
          Id_Formule_Cocktail : 4,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 5,
          Id_Client : 5,
          Id_Formule_Box : 5,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 6,
          Id_Client : 5,
          Id_Formule_Brunch : 6,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 7,
          Id_Client : 5,
          Id_Formule_Brunch : 7,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 8,
          Id_Client : 5,
          Id_Formule_Brunch : 8,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 9,
          Id_Client : 5,
          Id_Formule_Brunch : 9,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 10,
          Id_Client : 5,
          Id_Formule_Brunch : 10,
          Date_Evenement : '2020-08-27 19:00:00',
        },
        {
          Id_Estimation : 11,
          Id_Client : 5,
          Id_Formule_Aperitif : 3,
          Id_Formule_Cocktail : 4,
          Id_Formule_Box : 5,
          Id_Formule_Brunch : 6,
          Date_Evenement : '2020-08-27 19:00:00',
        },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Estimations', null, {});
  }
};

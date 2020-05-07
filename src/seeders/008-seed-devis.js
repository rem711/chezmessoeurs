'use strict';

const moment = require('moment')
const date = moment.utc().format('YYYYMMDD')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Devis', [
        {
          Id_Devis : 1,
          Numero_Devis : `DE_${date}_0001_UN`,
          Id_Client : 1,
          Date_Evenement : '2020-03-22 11:00:00',
          Adresse_Livraison_Adresse : '123 rue du chemin',
          Adresse_Livraison_Adresse_Complement_1 : 'Etage 2',
          Adresse_Livraison_Adresse_Complement_2 : 'Porte droite',
          Adresse_Livraison_CP : '21000',
          Adresse_Livraison_Ville : 'Dijon',
          Id_Estimation : 1,
          Id_Formule_Aperitif : 2,
          Statut : 'En cours',
          Liste_Options : '8;',
          Prix_HT : 158.4,
          Prix_TTC : 174.24
        },
        {
          Id_Devis : 2,
          Numero_Devis : `DE_${date}_0002_CINQ`,
          Id_Client : 5,
          Date_Evenement : '2020-08-27 19:00:00',
          Adresse_Livraison_Adresse : '13 route du champs',
          Adresse_Livraison_CP : '21000',
          Adresse_Livraison_Ville : 'Dijon',
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

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Clients', [
        {
          Id_Client : 1,
          Nom_Prenom : 'client1',
          Adresse_Facturation : 'adresse client 1',
          Email : 'client1@mail.com',
          Telephone : '1111111111',
          Type : 'Professionnel',
          Dernier_Statut : 'Devis en cours'
        },
        {
          Id_Client : 2,
          Nom_Prenom : 'client2',
          Adresse_Facturation : 'adresse client 2',
          Email : 'client2@mail.com',
          Telephone : '2222222222',
          Type : 'Professionnel'
        },
        {
          Id_Client : 3,
          Nom_Prenom : 'client3',
          Adresse_Facturation : 'adresse client 3',
          Email : 'client3@mail.com',
          Telephone : '3333333333',
          Type : 'Particulier'
        },
        {
          Id_Client : 4,
          Nom_Prenom : 'client4',
          Adresse_Facturation : 'adresse client 4',
          Email : 'client4@mail.com',
          Telephone : '4444444444',
          Type : 'Particulier'
        },
        {
          Id_Client : 5,
          Nom_Prenom : 'Client Test',
          Adresse_Facturation : 'adresse Facturation Client Test',
          Email : 'client-test@mail.com',
          Telephone : '0000000000',
          Type : 'Professionnel'
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};

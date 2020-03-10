'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Clients', [
        {
            Nom_Prenom : 'client1',
            Adresse_Facturation : 'adresse client 1',
            Email : 'client1@mail.com',
            Telephone : '1111111111',
            Type : 'Professionnel',
            Dernier_Statut : 'Devis en cours'
        },
        {
            Nom_Prenom : 'client2',
            Adresse_Facturation : 'adresse client 2',
            Email : 'client2@mail.com',
            Telephone : '2222222222',
            Type : 'Professionnel'
        },
        {
            Nom_Prenom : 'client3',
            Adresse_Facturation : 'adresse client 3',
            Email : 'client3@mail.com',
            Telephone : '3333333333',
            Type : 'Particulier'
        },
        {
            Nom_Prenom : 'client4',
            Adresse_Facturation : 'adresse client 4',
            Email : 'client4@mail.com',
            Telephone : '4444444444',
            Type : 'Particulier'
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};

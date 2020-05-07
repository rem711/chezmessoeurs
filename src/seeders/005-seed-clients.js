'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Clients', [
            {
                Id_Client : 1,
                Nom : 'Un',
                Prenom : 'Client',
                Societe : 'ma boite',
                Adresse_Facturation_Adresse : '123 rue du chemin',
                Adresse_Facturation_Adresse_Complement_1 : 'Etage 2',
                Adresse_Facturation_Adresse_Complement_2 : 'Porte droite',
                Adresse_Facturation_CP : '21000',
                Adresse_Facturation_Ville : 'Dijon',
                Numero_TVA : 'FR01123456789',
                Email : 'client1@mail.com',
                Telephone : '1111111111',
                Type : 'Professionnel',
                Dernier_Statut : 'Devis en cours'
            },
            {
                Id_Client : 2,
                Nom : 'Deux',
                Prenom : 'Client',
                Societe : 'ma boite2',
                Adresse_Facturation_Adresse : '123 rue du chemin',
                Adresse_Facturation_Adresse_Complement_1 : 'Etage 2',
                Adresse_Facturation_Adresse_Complement_2 : 'Porte gauche',
                Adresse_Facturation_CP : '21000',
                Adresse_Facturation_Ville : 'Dijon',
                Numero_TVA : 'FR02123456789',
                Email : 'client2@mail.com',
                Telephone : '2222222222',
                Type : 'Professionnel'
            },
            {
                Id_Client : 3,
                Nom : 'Trois',
                Prenom : 'Client',
                Adresse_Facturation_Adresse : '7 bis rue du chemin',
                Adresse_Facturation_Adresse_Complement_1 : 'Rez de chaussée',
                Adresse_Facturation_Adresse_Complement_2 : 'Porte droite',
                Adresse_Facturation_CP : '21000',
                Adresse_Facturation_Ville : 'Dijon',
                Email : 'client3@mail.com',
                Telephone : '3333333333',
                Type : 'Particulier'
            },
            {
                Id_Client : 4,
                Nom : 'Quatre',
                Prenom : 'Client',
                Adresse_Facturation_Adresse : '',
                Adresse_Facturation_Adresse_Complement_1 : '',
                Adresse_Facturation_Adresse_Complement_2 : '',
                Adresse_Facturation_CP : '',
                Adresse_Facturation_Ville : '',
                Email : 'client4@mail.com',
                Telephone : '4444444444',
                Type : 'Particulier'
            },
            {
                Id_Client : 5,
                Nom : 'Cinq',
                Prenom : 'Client',
                Societe : 'mycompany',
                Adresse_Facturation_Adresse : 'rue de la grande',
                Adresse_Facturation_CP : '21000',
                Adresse_Facturation_Ville : 'Dijon',
                Numero_TVA : 'FR05123456789',
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

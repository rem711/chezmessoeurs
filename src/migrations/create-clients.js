'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Clients', {
      Id_Client: {
        field : 'Id_Client',
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Nom_Prenom: {
        field : 'Nom_Prenom',
        type: Sequelize.STRING(350),
        allowNull: false,
        validate : {
          notNull : {
            msg : 'Le nom et prénom doivent être indiqués.'
          }
        }
      },
      Adresse_Facturation: {
        field : 'Adresse_Facturation',
        type: Sequelize.STRING(1000),
        allowNull: false,
        validate : {
          notNull : {
            msg : 'L\'adresse de facturation doit être renseignée.'
          }
        }
      },
      Email: {
        field : 'Email',
        type: Sequelize.STRING(320),
        allowNull: false,
        validate : {
          isEmail: {
            msg : 'L\'adresse e-mail est incorrecte.'
          },
          notNull : {
            msg : 'L\'adresse e-mail doit être renseignée.'
          }
        }
      },
      Telephone: {
        field : 'Telephone',
        type: Sequelize.STRING(10),
        allowNull: false,
        validate : {
          notNull : {
            msg : 'Le numéro de téléphone doit être renseigné.'
          },
                  isPhoneNumber : value => {
                      if(!value.match(/[0-9]{10}/)) {
                          throw new Error('Numéro de téléphone invalide')
                      }
                  }
              }
      },
      Type: {
        field : 'Type',
        // type: Sequelize.STRING(13),
        type : Sequelize.ENUM('Professionnel', 'Particulier'),
        allowNull: false,
        validate : {
          notNull : {
            msg : 'Le type doit être renseigné.'
          },
          isIn : {
            args : [['Professionnel', 'Particulier']],
            msg : 'Le type doit être Professionnel ou Particulier'
          }
        }
      },
      Nombre_Prestations: {
        field : 'Nombre_Prestations',
        type: Sequelize.INTEGER(4).UNSIGNED,
        allowNull: false,
        defaultValue: '0'
      },
      Dernier_Statut: {
        field : 'Dernier_Statut',
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue : null
      },
      Paiement_En_Retard: {
        field : 'Paiement_En_Retard',
        type: Sequelize.INTEGER(4).UNSIGNED,
        allowNull: false,
        defaultValue: '0'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Clients');
  }
};
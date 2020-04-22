'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Estimations', {
      Id_Estimation: {
        field : 'Id_Estimation',
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Date_Creation: {
        field : 'Date_Creation',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      Id_Client: {
        field : 'Id_Client',
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      Date_Evenement: {
        field : 'Date_Evenement',
        type: Sequelize.DATE,
        allowNull: false
      },
      Id_Formule_Aperitif: {
        field : 'Id_Formule_Aperitif',
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      Id_Formule_Cocktail: {
        field : 'Id_Formule_Cocktail',
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      Id_Formule_Box: {
        field : 'Id_Formule_Box',
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      Id_Formule_Brunch: {
        field : 'Id_Formule_Brunch',
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      Commentaire: {
        field : 'Commentaire',
        type: Sequelize.STRING(1000),
        allowNull: true,
        validate : {
          len : {
            args : [0, 1000],
            msg : 'Le commentaire est trop long, maximum 1000 caractères.'
          }
        }
      },
      Statut: {
        field : 'Statut',
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue : 'En cours'
      }
    })
    .then(() => {
      return queryInterface.addConstraint('Estimations', ['Id_Client'], {
        type : 'foreign key',
        name : 'FK_Client_Estimations',
        references: {
          table: 'clients',
          field: 'Id_Client'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Estimations', 'FK_Client_Estimations')    
    .then(() => {
      return queryInterface.dropTable('Estimations')
    })
  }
};
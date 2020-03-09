'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Factures', {
        Id_Facture: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero_Facture: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		Date_Creation: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		},
		Id_Client: {
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
		Date_Evenement: {
			type: Sequelize.DATE,
			allowNull: false
		},
		Adresse_Livraison: {
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Id_Devis: {
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
		Id_Formule_Aperitif: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Cocktail: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Box: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Brunch: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Commentaire: {
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Statut: {
			type: Sequelize.STRING(30),
			allowNull: false,
			defaultValue: 'En attente de paiement'
		},
		Liste_Options: {
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Id_Remise: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Prix_HT: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Prix_TTC: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Acompte: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Reste_A_Payer: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Paiement_En_Retard: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		Nb_Relances: {
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Date_Derniere_Relance: {
			type: Sequelize.DATE,
			allowNull: true
		}
    })
    .then(() => {
        return queryInterface.addConstraint('Factures', ['Id_Client'], {
          type : 'foreign key',
          name : 'FK_Client_Factures',
          references: {
            table: 'clients',
            field: 'Id_Client'
          },
          onDelete : 'cascade',
          onUpdate : 'cascade'
        })
      })
      .then(() => {
          return queryInterface.addConstraint('Factures', ['Id_Devis'], {
            type : 'foreign key',
            name : 'FK_Devis_Factures',
            references: {
              table: 'devis',
              field: 'Id_Devis'
            },
            onDelete : 'cascade',
            onUpdate : 'cascade'
          })
      })
      .then(() => {
          return queryInterface.addConstraint('Factures', ['Id_Remise'], {
              type : 'foreign key',
              name : 'FK_Remise_Factures',
              references : {
                  table : 'remises',
                  field : 'Id_Remise'
              },
              onDelete : 'restrict',
              onUpdate : 'cascade'
          })
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Factures', 'FK_Remise_Factures')
    .then(() => {
        return queryInterface.removeConstraint('Factures', 'FK_Devis_Factures')
    })
    .then(() => {
        return queryInterface.removeConstraint('Factures', 'FK_Client_Factures')
    })
    .then(() => {
      return queryInterface.dropTable('Factures')
    })
  }
};
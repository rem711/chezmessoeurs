'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Factures', {
        Id_Facture: {
			field : 'Id_Facture',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero_Facture: {
			field : 'Numero_Facture',
			type: Sequelize.STRING(100),
			allowNull: false
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
		Adresse_Livraison: {
			field : 'Adresse_Livraison',
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Id_Devis: {
			field : 'Id_Devis',
			type: Sequelize.INTEGER(11),
			allowNull: true
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
			type: Sequelize.STRING(30),
			allowNull: false,
			defaultValue: 'En attente'
		},
		Liste_Options: {
			field : 'Liste_Options',
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Id_Remise: {
			field : 'Id_Remise',
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		Prix_HT: {
			field : 'Prix_HT',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Prix_TTC: {
			field : 'Prix_TTC',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Acompte: {
			field : 'Acompte',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Reste_A_Payer: {
			field : 'Reste_A_Payer',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Paiement_En_Retard: {
			field : 'Paiement_En_Retard',
			type: Sequelize.STRING(100),
			allowNull: false,
			defaultValue : 'Non'
		},
		Nb_Relances: {
			field : 'Nb_Relances',
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Date_Derniere_Relance: {
			field : 'Date_Derniere_Relance',
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue : null
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
            onDelete : 'SET NULL',
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
			  onDelete : 'SET NULL',
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
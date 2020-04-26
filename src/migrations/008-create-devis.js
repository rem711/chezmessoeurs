'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Devis', {
        Id_Devis: {
			field : 'Id_Devis',
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
		Adresse_Livraison: {
			field : 'Adresse_Livraison',
			type: Sequelize.STRING(1000),
			allowNull: false
		},
		Id_Estimation: {
			field : 'Id_Estimation',
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
			type: Sequelize.STRING(10),
			allowNull: false,
			defaultValue : 'En cours'
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
		}
    })
    .then(() => {
      return queryInterface.addConstraint('Devis', ['Id_Client'], {
        type : 'foreign key',
        name : 'FK_Client_Devis',
        references: {
          table: 'clients',
          field: 'Id_Client'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      })
    })
    .then(() => {
        return queryInterface.addConstraint('Devis', ['Id_Estimation'], {
          type : 'foreign key',
          name : 'FK_Estimation_Devis',
          references: {
            table: 'estimations',
            field: 'Id_Estimation'
          },
          onDelete : 'set null',
          onUpdate : 'cascade'
        })
    })
    .then(() => {
        return queryInterface.addConstraint('Devis', ['Id_Remise'], {
            type : 'foreign key',
            name : 'FK_Remise_Devis',
            references : {
                table : 'remises',
                field : 'Id_Remise'
            },
            onDelete : 'set null',
            onUpdate : 'cascade'
        })
    })
      
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Devis', 'FK_Remise_Devis')
    .then(() => {
        return queryInterface.removeConstraint('Devis', 'FK_Client_Devis')
    })
    .then(() => {
        return queryInterface.removeConstraint('Devis', 'FK_Estimation_Devis')
    })    
    .then(() => {
      return queryInterface.dropTable('Devis')
    })
  }
};
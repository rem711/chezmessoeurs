'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Devis', {
        Id_Devis: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
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
			allowNull: false
		},
		Id_Estimation: {
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
			type: Sequelize.STRING(10),
			allowNull: false
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
          onDelete : 'cascade',
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
            onDelete : 'restrict',
            onUpdate : 'cascade'
        })
    })
      
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Estimations', 'FK_Remise_Devis')
    .then(() => {
        return queryInterface.removeConstraint('Estimations', 'FK_Client_Devis')
    })
    .then(() => {
        return queryInterface.removeConstraint('Estimations', 'FK_Estimation_Devis')
    })    
    .then(() => {
      return queryInterface.dropTable('Estimations')
    })
  }
};
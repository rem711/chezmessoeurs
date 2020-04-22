'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Prix_Unitaire', {
        Id_Prix_Unitaire: {
			field : 'Id_Prix_Unitaire',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom_Type_Prestation: {
			field : 'Nom_Type_Prestation',
			type: Sequelize.STRING(100),
			allowNull: false,
			validate : {
				len : {
					args : [2, 100],
					msg : 'Le nom du type de prestation doit être compris entre 2 et 100 caractères.'
				}
			}
		},
		IsOption: {
			field : 'IsOption',
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: 0
		},
		Montant: {
			field : 'Montant',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Prix_Unitaire')
  }
};
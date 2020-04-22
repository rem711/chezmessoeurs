'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Remises', {
        Id_Remise: {
			field : 'Id_Remise',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			field : 'Nom',
			type: Sequelize.STRING(1000),
			allowNull: false,
			validate : {
				len : {
					args : [3, 1000],
					msg : 'Le nom de la remise doit être compris entre 3 et 1000 caractères.'
				}
			}
		},
		IsPourcent: {
			field : 'IsPourcent',
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: 0
		},
		Valeur: {
			field : 'Valeur',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Remises')
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Remises', {
        Id_Remise: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			type: Sequelize.STRING(1000),
			allowNull: false
		},
		IsPourcent: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		Valeur: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Remises')
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Remises', {
        Id_Remise: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			type: DataTypes.STRING(1000),
			allowNull: false
		},
		IsPourcent: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		Valeur: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Remises')
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Prix_Unitaire', {
        Id_Prix_Unitaire: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom_Type_Prestation: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		IsOption: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		Montant: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Prix_Unitaire')
  }
};
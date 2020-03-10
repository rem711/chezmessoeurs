'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Type_Formule', {
        Id_Type_Formule: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			type: Sequelize.STRING(100),
			allowNull: false
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Type_Formule')
  }
};
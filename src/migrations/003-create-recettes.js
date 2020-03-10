'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Recettes', {
        Id_Recette: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Categorie: {
			type: Sequelize.STRING(10),
			allowNull: false
		},
		Nom: {
			type: Sequelize.STRING(256),
			allowNull: false
		},
		Description: {
			type: Sequelize.STRING(1000),
			allowNull: true
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Recettes')
  }
};
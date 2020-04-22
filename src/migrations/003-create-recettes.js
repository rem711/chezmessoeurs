'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Recettes', {
        Id_Recette: {
			field : 'Id_Recette',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Categorie: {
			field : 'Categorie',
			type: Sequelize.STRING(10),
			allowNull: false
		},
		Nom: {
			field : 'Nom',
			type: Sequelize.STRING(256),
			allowNull: false,
			validate : {
				len : {
					args : [2, 256],
					msg : 'Le nom de la recette doit être compris entre 2 et 256 caractères.'
				}
			}
		},
		Description: {
			field : 'Description',
			type: Sequelize.STRING(1000),
			allowNull: true,
			validate : {
				len : {
					args : [0, 1000],
					msg : 'La description est trop longue, maximum 1000 caractères.'
				}
			}
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Recettes')
  }
};
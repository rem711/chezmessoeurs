'use strict';
module.exports = (sequelize, DataTypes) => {
    const Recettes = sequelize.define('Recettes', {
        Id_Recette: {
			field : 'Id_Recette',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Categorie: {
			field : 'Categorie',
			type: DataTypes.STRING(10),
			allowNull: false
		},
		Nom: {
			field : 'Nom',
			type: DataTypes.STRING(256),
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
			type: DataTypes.STRING(1000),
			allowNull: true,
			validate : {
				len : {
					args : [0, 1000],
					msg : 'La description est trop longue, maximum 1000 caractères.'
				}
			}
		}
    }, {
		tableName : 'recettes'
	})

    return Recettes
}
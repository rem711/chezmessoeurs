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
			allowNull: false
		},
		Description: {
			field : 'Description',
			type: DataTypes.STRING(1000),
			allowNull: true
		}
    }, {})

    return Recettes
}
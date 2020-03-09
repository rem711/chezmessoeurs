'use strict';
module.exports = (sequelize, DataTypes) => {
    const Recettes = sequelize.define('Recettes', {
        Id_Recette: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Categorie: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		Nom: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		Description: {
			type: DataTypes.STRING(1000),
			allowNull: true
		}
    }, {})

    return Recettes
}
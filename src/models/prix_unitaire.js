'use strict';
module.exports = (sequelize, DataTypes) => {
    const Prix_Unitaire = sequelize.define('Prix_Unitaire', {
        Id_Prix_Unitaire: {
			field : 'Id_Prix_Unitaire',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom_Type_Prestation: {
			field : 'Nom_Type_Prestation',
			type: DataTypes.STRING(100),
			allowNull: false,
			validate : {
				len : {
					args : [2, 100],
					msg : 'Le nom du type de prestation doit être compris entre 2 et 100 caractères.'
				}
			}
		},
		IsOption: {
			field : 'IsOption',
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		Montant: {
			field : 'Montant',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    }, {})

    return Prix_Unitaire
}
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Remises = sequelize.define('Remises', {
        Id_Remise: {
			field : 'Id_Remise',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			field : 'Nom',
			type: DataTypes.STRING(1000),
			allowNull: false,
			validate : {
				len : {
					args : [3, 1000],
					msg : 'Le nom de la remise doit être compris entre 3 et 1000 caractères.'
				}
			}
		},
		IsPourcent: {
			field : 'IsPourcent',
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: 0
		},
		Valeur: {
			field : 'Valeur',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
		}
    }, {
		tableName : 'remises'
	})
    Remises.associate = models => {
        // Remises.hasMany(models.Devis),
        // Remises.hasMany(models.Factures)
    }

    return Remises
}
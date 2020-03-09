'use strict';
module.exports = (sequelize, DataTypes) => {
    const Remises = sequelize.define('Remises', {
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
    }, {})
    Remises.associate = models => {
        Remises.hasMany(models.Devis),
        Remises.hasMany(models.Factures)
    }

    return Remises
}
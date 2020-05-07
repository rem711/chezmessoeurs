'use strict';
module.exports = (sequelize, DataTypes) => {
    const Compteurs = sequelize.define('Compteurs', {
        Id_Avoir: {
			field : 'Id_Avoir',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Compteur_Factures_Avoirs: {
			field : 'Compteur_Factures_Avoirs',
			type: DataTypes.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		},
		Compteur_Acomptes: {
			field : 'Compteur_Acomptes',
			type: DataTypes.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		}
    }, {
		tableName : 'avoirs'
	})
    Avoir.associate = models => {
        
    }

    return Compteurs
}
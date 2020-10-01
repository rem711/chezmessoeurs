'use strict';
module.exports = (sequelize, DataTypes) => {
    const Compteurs = sequelize.define('Compteurs', {
        Nom_Compteur: {
			field : 'Nom_Compteur',
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique : true
		},
		Valeur_Compteur: {
			field : 'Valeur_Compteur',
			type: DataTypes.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		}
    }, {
		tableName : 'compteurs'
	})
    Compteurs.associate = models => {
        
    }

    return Compteurs
}
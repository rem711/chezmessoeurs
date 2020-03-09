'use strict';
module.exports = (sequelize, DataTypes) => {
    const Prix_Unitaire = sequelize.define('Prix_Unitaire', {
        Id_Prix_Unitaire: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom_Type_Prestation: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		IsOption: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		Montant: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    }, {})

    return Prix_Unitaire
}
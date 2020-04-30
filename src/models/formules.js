'use strict';
module.exports = (sequelize, DataTypes) => {
    const Formules = sequelize.define('Formules', {
        Id_Formule: {
			field : 'Id_Formule',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Id_Type_Formule: {
			field : 'Id_Type_Formule',
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Nb_Convives: {
			field : 'Nb_Convives',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Prix_HT: {
			field : 'Prix_HT',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Nb_Pieces_Salees: {
			field : 'Nb_Pieces_Salees',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Nb_Pieces_Sucrees: {
			field : 'Nb_Pieces_Sucrees',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Nb_Boissons: {
			field : 'Nb_Boissons',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Liste_Id_Recettes_Salees: {
			field : 'Liste_Id_Recettes_Salees',
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Sucrees: {
			field : 'Liste_Id_Recettes_Sucrees',
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Boissons: {
			field : 'Liste_Id_Recettes_Boissons',
			type: DataTypes.STRING(1000),
			allowNull: true
		}
    }, {
		tableName : 'formules'
	})
    Formules.associate = models => {
        Formules.belongsTo(models.Type_Formule, { foreignKey : 'Id_Type_Formule'})
    }

    return Formules
}
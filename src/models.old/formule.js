/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('formule', {
		Id_Formule: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Id_Type_Formule: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'type_formule',
				key: 'Id_Type_Formule'
			}
		},
		Nb_Convives: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Prix_HT: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Nb_Pieces_Salees: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Nb_Pieces_Sucrees: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Nb_Boissons: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Liste_Id_Recettes_Salees: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Sucrees: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Boissons: {
			type: DataTypes.STRING(1000),
			allowNull: true
		}
	}, {
		tableName: 'formule'
	});
};

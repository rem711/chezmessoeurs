/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('remises', {
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
	}, {
		tableName: 'remises'
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('type_formule', {
		Id_Type_Formule: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			type: DataTypes.STRING(100),
			allowNull: false
		}
	}, {
		tableName: 'type_formule'
	});
};

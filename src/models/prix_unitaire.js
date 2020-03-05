/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('prix_unitaire', {
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
	}, {
		tableName: 'prix_unitaire'
	});
};

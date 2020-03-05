/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('recettes', {
		Id_Recette: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Categorie: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		Nom: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		Description: {
			type: DataTypes.STRING(1000),
			allowNull: true
		}
	}, {
		tableName: 'recettes'
	});
};

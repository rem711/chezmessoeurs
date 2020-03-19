'use strict';
module.exports = (sequelize, DataTypes) => {
  const Estimations = sequelize.define('Estimations', {
    Id_Estimation: {
			field : 'Id_Estimation',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Date_Creation: {
			field : 'Date_Creation',
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		Id_Client: {
			field : 'Id_Client',
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Date_Evenement: {
			field : 'Date_Evenement',
			type: DataTypes.DATE,
			allowNull: false
		},
		Id_Formule_Aperitif: {
			field : 'Id_Formule_Aperitif',
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Cocktail: {
			field : 'Id_Formule_Cocktail',
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Box: {
			field : 'Id_Formule_Box',
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Brunch: {
			field : 'Id_Formule_Brunch',
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Commentaire: {
			field : 'Commentaire',
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Statut: {
			field : 'Statut',
			type: DataTypes.STRING(10),
			allowNull: true,
			defaultValue : 'En cours'
		}
  }, {});
  Estimations.associate = function(models) {
    // associations can be defined here
	Estimations.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
	// Estimations.hasOne(models.Devis)
  };
  return Estimations;
};
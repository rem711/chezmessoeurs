'use strict';
module.exports = (sequelize, DataTypes) => {
    const Devis = sequelize.define('Devis', {
        Id_Devis: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Date_Creation: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		Id_Client: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Date_Evenement: {
			type: DataTypes.DATE,
			allowNull: false
		},
		Adresse_Livraison: {
			type: DataTypes.STRING(1000),
			allowNull: false
		},
		Id_Estimation: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Id_Formule_Aperitif: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Cocktail: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Box: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Id_Formule_Brunch: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Commentaire: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Statut: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		Liste_Options: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Id_Remise: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Prix_HT: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Prix_TTC: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    }, {})
    Devis.associate = models => {
        Devis.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
        Devis.belongsTo(models.Estimations, { foreignKey : 'Id_Estimation' })
        Devis.belongsTo(models.Remises, { foreignKey : 'Id_Remise' })
    }

    return Devis
}
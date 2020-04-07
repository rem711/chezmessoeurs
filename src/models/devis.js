'use strict';
module.exports = (sequelize, DataTypes) => {
    const Devis = sequelize.define('Devis', {
        Id_Devis: {
			field : 'Id_Devis',
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
		Adresse_Livraison: {
			field : 'Adresse_Livraison',
			type: DataTypes.STRING(1000),
			allowNull: false
		},
		Id_Estimation: {
			field : 'Id_Estimation',
			type: DataTypes.INTEGER(11),
			allowNull: true
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
			allowNull: true,
			validate : {
				len : {
					args : [0, 1000],
					msg : 'Le commentaire est trop long, maximum 1000 caractères.'
				}
			}
		},
		Statut: {
			field : 'Statut',
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue : 'En cours'
		},
		Liste_Options: {
			field : 'Liste_Options',
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Id_Remise: {
			field : 'Id_Remise',
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Prix_HT: {
			field : 'Prix_HT',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Prix_TTC: {
			field : 'Prix_TTC',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		}
    }, {})
    Devis.associate = models => {
        Devis.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
        Devis.belongsTo(models.Estimations, { foreignKey : 'Id_Estimation' })
		Devis.belongsTo(models.Remises, { foreignKey : 'Id_Remise' })
		Devis.belongsTo(models.Formules, { foreignKey : 'Id_Formule_Aperitif', as : 'Formule_Aperitif' })
		Devis.belongsTo(models.Formules, { foreignKey : 'Id_Formule_Cocktail', as : 'Formule_Cocktail' })
		Devis.belongsTo(models.Formules, { foreignKey : 'Id_Formule_Box', as : 'Formule_Box' })
		Devis.belongsTo(models.Formules, { foreignKey : 'Id_Formule_Brunch', as : 'Formule_Brunch' })
    }

    return Devis
}
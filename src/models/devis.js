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
		Numero_Devis: {
			field : 'Numero_Devis',
			type : DataTypes.STRING(500),
			allowNull : false
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
		Adresse_Livraison_Adresse: {
			field : 'Adresse_Livraison_Adresse',
			type: DataTypes.STRING(500),
			allowNull: true,
			defaultValue: '',
			validate : {
				len : {
					args : [0, 500],
					msg : 'L\'adresse de livraison est limité à 500 caractères.'
				}
			}
		},
		Adresse_Livraison_Adresse_Complement_1: {
			field : 'Adresse_Livraison_Adresse_Complement_1',
			type: DataTypes.STRING(500),
			allowNull: true,
			defaultValue: '',
			validate : {
				len : {
					args : [0, 500],
					msg : 'Le complément 1 d\'adresse de livraison est limité à 500 caractères.'
				}
			}
		},
		Adresse_Livraison_Adresse_Complement_2: {
			field : 'Adresse_Livraison_Adresse_Complement_2',
			type: DataTypes.STRING(500),
			allowNull: true,
			defaultValue: '',
			validate : {
				len : {
					args : [0, 500],
					msg : 'Le complément 2 d\'adresse de livraison est limité à 500 caractères.'
				}
			}
		},
		Adresse_Livraison_CP: {
			field : 'Adresse_Livraison_CP',
			type: DataTypes.STRING(5),
			allowNull: true,
			defaultValue: '00000',
			validate : {
				isNumeric : {
					msg : 'Le code postal doit être composé de 5 chiffres.'
				},
				len : {
					args : [5, 5],
					msg : 'Le code postal doit être composé de 5 chiffres.'
				}
			}
		},
		Adresse_Livraison_Ville: {
			field : 'Adresse_Livraison_Ville',
			type: DataTypes.STRING(500),
			allowNull: true,
			defaultValue: '',
			validate : {
				len : {
					args : [0, 500],
					msg : 'La ville de l\'adresse de livraison est limité à 500 caractères.'
				}
			}
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
			defaultValue: 0
		},
		Prix_TTC: {
			field : 'Prix_TTC',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
		}
    }, {
		tableName : 'devis'
	})
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
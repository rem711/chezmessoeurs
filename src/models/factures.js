'use strict';
module.exports = (sequelize, DataTypes) => {
    const Factures = sequelize.define('Factures', {
        Id_Facture: {
			field : 'Id_Facture',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Ref_Facture: {
			field : 'Ref_Facture',
			type: DataTypes.STRING(100),
			allowNull: false,
			unique : true
		},		
		Type_Facture: {
			field : 'Type_Facture',
			type: DataTypes.ENUM('acompte', 'solde'),
			allowNull: false
		},				
		Id_Vente: {
			field : 'Id_Vente',
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Description: {
            field : 'Description',
            type : DataTypes.TEXT,
            allowNull : false,
            defaultValue : ''
        },
		Pourcentage_Acompte: {
			field : 'Pourcentage_Acompte',
			type : DataTypes.FLOAT
		},
		Prix_TTC: {
			field : 'Prix_TTC',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		IsPayed: {
			field : 'IsPayed',
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
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
		Date_Creation: {
			field : 'Date_Creation',
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
    }, {
		tableName : 'factures'
	})
    Factures.associate = models => {
		Factures.belongsTo(models.Ventes, { foreignKey : 'Id_Vente' })
    }

    return Factures
}
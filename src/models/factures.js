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
			unique : {
				args : true,
				msg : "Le numéro de référence facture doit être unique.",
				fields : ['Ref_Facture']
			}
		},		
		Type_Facture: {
			field : 'Type_Facture',
			type: DataTypes.ENUM('acompte', 'solde', 'avoir'),
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
			type : DataTypes.FLOAT,
			allowNull: true,
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
		IsCanceled: {
			field : 'IsCanceled',
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		IdFactureAnnulee: {
			field : 'IdFactureAnnulee',
			type : DataTypes.INTEGER,
			allowNull : true,
			defaultValue : null
		},
		Date_Paiement_Du: {
			field : 'Date_Paiement_Du',
			type : DataTypes.DATE,
			allowNull : false
		},
		Mode_Paiement: {
			field : 'Mode_Paiement',
			type : DataTypes.ENUM('CB', 'chèque', 'virement bancaire'),
			allowNull: false,
			defaultValue: 'chèque',
			validate : {
				notNull : {
					msg : 'Le mode de paiement doit être renseigné.'
				},
				isIn : {
					args : [['CB', 'chèque', 'virement bancaire']],
					msg : 'Le mode de paiement doit être soit CB, soit chèque soit par virement bancaire.'
				}
			}
		},
		Created_At: {
			field : 'Created_At',
			type : DataTypes.DATE
		},
		Updated_At: {
			field : 'Updated_At',
			type : DataTypes.DATE
		}
    }, {
		tableName : 'factures'
	})
    Factures.associate = models => {
		Factures.belongsTo(models.Ventes, { foreignKey : 'Id_Vente' })
		Factures.belongsTo(Factures, { foreignKey : 'IdFactureAnnulee', as : 'FactureAnnulee' })
    }

    return Factures
}
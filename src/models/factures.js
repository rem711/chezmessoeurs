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
		Date_Paiement_Du: {
			field : 'Date_Paiement_Du',
			type : DataTypes.DATE,
			allowNull : false
		}
    }, {
		tableName : 'factures'
	})
    Factures.associate = models => {
		Factures.belongsTo(models.Ventes, { foreignKey : 'Id_Vente' })
    }

    return Factures
}
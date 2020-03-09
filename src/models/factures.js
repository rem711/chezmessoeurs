'use strict';
module.exports = (sequelize, DataTypes) => {
    const Factures = sequelize.define('Factures', {
        Id_Facture: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero_Facture: {
			type: DataTypes.STRING(100),
			allowNull: false
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
			allowNull: true
		},
		Id_Devis: {
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
			type: DataTypes.STRING(30),
			allowNull: false,
			defaultValue: 'En attente de paiement'
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
		},
		Acompte: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Reste_A_Payer: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: '0'
		},
		Paiement_En_Retard: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		Nb_Relances: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Date_Derniere_Relance: {
			type: DataTypes.DATE,
			allowNull: true
		}
    }, {})
    Factures.associate = models => {
        Factures.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
        Factures.belongsTo(models.Devis, { foreignKey : 'Id_Devis' })
        Factures.belongsTo(models.Remise, { foreignKey : 'Id_Remise' })
    }

    return Factures
}
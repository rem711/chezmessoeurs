/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('factures', {
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
			allowNull: false,
			references: {
				model: 'clients',
				key: 'Id_Client'
			}
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
			allowNull: false,
			references: {
				model: 'devis',
				key: 'Id_Devis'
			}
		},
		Id_Formule_Aperitif: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Cocktail: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Box: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Brunch: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
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
			allowNull: true,
			references: {
				model: 'remises',
				key: 'Id_Remise'
			}
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
	}, {
		tableName: 'factures'
	});
};

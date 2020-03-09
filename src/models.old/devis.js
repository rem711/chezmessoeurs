/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('devis', {
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
			allowNull: false
		},
		Id_Estimation: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'estimations',
				key: 'Id_Estimation'
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
			type: DataTypes.STRING(10),
			allowNull: false
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
		}
	}, {
		tableName: 'devis'
	});
};

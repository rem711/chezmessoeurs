/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
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
		// Id_Client: {
		// 	field : 'Id_Client',
		// 	type: DataTypes.INTEGER(11),
		// 	allowNull: false
		// },
		Date_Evenement: {
			field : 'Date_Evenement',
			type: DataTypes.DATE,
			allowNull: false
		},
		Id_Formule_Aperitif: {
			field : 'Id_Formule_Aperitif',
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Cocktail: {
			field : 'Id_Formule_Cocktail',
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Box: {
			field : 'Id_Formule_Box',
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Id_Formule_Brunch: {
			field : 'Id_Formule_Brunch',
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formule',
				key: 'Id_Formule'
			}
		},
		Commentaire: {
			field : 'Commentaire',
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		Statut: {
			field : 'Statut',
			type: DataTypes.STRING(10),
			allowNull: true
		}
	}, {
		tableName: 'Estimations'
	});

	Estimations.associate = models => {
		Estimations.belongsTo(models.Clients)
	}

	return Estimations
};

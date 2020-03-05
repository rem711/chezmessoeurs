/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Clients', {
		Id_Client: {
			field : 'Id_Client',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom_Prenom: {
			field : 'Nom_Prenom',
			type: DataTypes.STRING(350),
			allowNull: false
		},
		Adresse_Facturation: {
			field : 'Adresse_Facturation',
			type: DataTypes.STRING(1000),
			allowNull: false
		},
		Email: {
			field : 'Email',
			type: DataTypes.STRING(320),
			allowNull: false
		},
		Telephone: {
			field : 'Telephone',
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
                isPhoneNumber : value => {
                    if(!value.match(/[0-9]{10}/)) {
                        throw new Error('Numéro de téléphone invalide')
                    }
                }
            }
		},
		Type: {
			field : 'Type',
			// type: DataTypes.STRING(13),
			type : DataTypes.ENUM,
            values : ['Professionnel', 'Particulier'],
			allowNull: false
		},
		Nombre_Prestations: {
			field : 'Nombre_Prestations',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		Dernier_Statut: {
			field : 'Dernier_Statut',
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue : null
		},
		Paiement_En_Retard: {
			field : 'Paiement_En_Retard',
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'clients'
	});
};

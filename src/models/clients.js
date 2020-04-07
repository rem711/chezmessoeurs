'use strict';
module.exports = (sequelize, DataTypes) => {
  const Clients = sequelize.define('Clients', {
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
			allowNull: false,
			validate : {
				notNull : {
					msg : 'Le nom et prénom doivent être indiqués.'
				},
				len : {
					args : [2, 350],
					msg : 'Le nom ne peut pas contenir plus de 350 cractères.'
				}
			}
		},
		Adresse_Facturation: {
			field : 'Adresse_Facturation',
			type: DataTypes.STRING(1000),
			allowNull: true,
			defaultValue: '',
			validate : {
				len : {
					args : [0, 1000],
					msg : 'L\'adresse de facturation est limité à 1000 caractères.'
				}
			}
		},
		Email: {
			field : 'Email',
			type: DataTypes.STRING(320),
			allowNull: false,
			validate : {
				isEmail: {
					msg : 'L\'adresse e-mail est incorrecte.'
				},
				notNull : {
					msg : 'L\'adresse e-mail doit être renseignée.'
				},
				len : {
					args : [6, 320],
					msg : 'L\'adresse e-mail est incorrecte.'
				}
			}
		},
		Telephone: {
			field : 'Telephone',
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
				notNull : {
					msg : 'Le numéro de téléphone doit être renseigné.'
				},
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
			type : DataTypes.ENUM('Professionnel', 'Particulier'),
			allowNull: false,
			defaultValue: 'Particulier',
			validate : {
				notNull : {
					msg : 'Le type doit être renseigné.'
				},
				isIn : {
					args : [['Professionnel', 'Particulier']],
					msg : 'Le type doit être Professionnel ou Particulier'
				}
			}
		},
		Nombre_Prestations: {
			field : 'Nombre_Prestations',
			type: DataTypes.INTEGER(4).UNSIGNED,
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
			type: DataTypes.INTEGER(4).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		}
  }, {});
  Clients.associate = function(models) {
	// associations can be defined here
	// Clients.hasMany(models.Estimations)
	// Clients.hasMany(models.Devis)
	// Clients.hasMany(models.Factures)
  };
  return Clients;
};
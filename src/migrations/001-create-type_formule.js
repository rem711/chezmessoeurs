'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Type_Formule', {
        Id_Type_Formule: {
			field : 'Id_Type_Formule',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			field : 'Nom',
			type: Sequelize.STRING(100),
			allowNull: false,
			validate : {
				isUndefined(value) {
					if(value === undefined || value === '') {
						throw new Error('Le nom ne peut pas être vide')
					}
				},
				len : {
					args : [2, 100],
					msg : 'Le nom du type de formule doit être compris entre 2 et 100 caractères.'
				}
			},
			unique : {
				args : true,
				msg : 'Type de formule déjà existant.'
			}
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Type_Formule')
  }
};
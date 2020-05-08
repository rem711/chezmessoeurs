'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Compteurs', {
        Nom_Compteur: {
			field : 'Nom_Compteur',
			type: Sequelize.STRING,
			allowNull: false,
			primaryKey: true,
			unique : true
		},
		Valeur_Compteur: {
			field : 'Valeur_Compteur',
			type: Sequelize.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		},
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Compteurs')
  }
};
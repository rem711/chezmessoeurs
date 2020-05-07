'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Compteurs', {
        Id_Avoir: {
			field : 'Id_Avoir',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Compteur_Factures_Avoirs: {
			field : 'Compteur_Factures_Avoirs',
			type: Sequelize.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		},
		Compteur_Acomptes: {
			field : 'Compteur_Acomptes',
			type: Sequelize.INTEGER(11),
            allowNull : false,
            defaultValue : 0
		}
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Compteurs')
  }
};
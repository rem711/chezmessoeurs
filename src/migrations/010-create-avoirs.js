'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Avoirs', {
        Id_Avoir: {
			field : 'Id_Avoir',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero_Avoir: {
			field : 'Numero_Avoir',
			type : Sequelize.STRING(500),
			allowNull : false,
			unique : true
		},
		Date_Creation: {
			field : 'Date_Creation',
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		},
		Id_Client: {
			field : 'Id_Client',
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
		Id_Facture: {
			field : 'Id_Facture',
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
    })
    .then(() => {
      return queryInterface.addConstraint('Avoirs', ['Id_Client'], {
        type : 'foreign key',
        name : 'FK_Client_Avoirs',
        references: {
          table: 'clients',
          field: 'Id_Client'
        },
        onDelete : 'no action',
        onUpdate : 'cascade'
      })
    })
    .then(() => {
        return queryInterface.addConstraint('Avoirs', ['Id_Facture'], {
          type : 'foreign key',
          name : 'FK_Facture_Avoirs',
          references: {
            table: 'factures',
            field: 'Id_Facture'
          },
          onDelete : 'no action',
          onUpdate : 'cascade'
        })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Avoirs', 'FK_Facture_Avoirs')
    .then(() => {
        return queryInterface.removeConstraint('Devis', 'FK_Client_Avoirs')
    })
    .then(() => {
      return queryInterface.dropTable('Avoirs')
    })
  }
};
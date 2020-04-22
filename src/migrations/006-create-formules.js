'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Formules', {
        Id_Formule: {
			field : 'Id_Formule',
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Id_Type_Formule: {
			field : 'Id_Type_Formule',
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
		Nb_Convives: {
			field : 'Nb_Convives',
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Prix_HT: {
			field : 'Prix_HT',
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		Nb_Pieces_Salees: {
			field : 'Nb_Pieces_Salees',
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Nb_Pieces_Sucrees: {
			field : 'Nb_Pieces_Sucrees',
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Nb_Boissons: {
			field : 'Nb_Boissons',
			type: Sequelize.INTEGER(4),
			allowNull: false,
			defaultValue: 0
		},
		Liste_Id_Recettes_Salees: {
			field : 'Liste_Id_Recettes_Salees',
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Sucrees: {
			field : 'Liste_Id_Recettes_Sucrees',
			type: Sequelize.STRING(1000),
			allowNull: true
		},
		Liste_Id_Recettes_Boissons: {
			field : 'Liste_Id_Recettes_Boissons',
			type: Sequelize.STRING(1000),
			allowNull: true
		}
    })
    .then(() => {
      return queryInterface.addConstraint('Formules', ['Id_Type_Formule'], {
        type : 'foreign key',
        name : 'FK_Type_Formule_Formule',
        references: {
          table: 'type_formule',
          field: 'Id_Type_Formule'
        },
        onDelete : 'restrict',
        onUpdate : 'cascade'
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Formules', 'FK_Type_Formule_Formule')    
    .then(() => {
      return queryInterface.dropTable('Formules')
    })
  }
};
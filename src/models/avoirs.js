'use strict';
module.exports = (sequelize, DataTypes) => {
    const Avoirs = sequelize.define('Avoirs', {
        Id_Avoir: {
			field : 'Id_Avoir',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero_Avoir: {
			field : 'Numero_Avoir',
			type : DataTypes.STRING(500),
			allowNull : false,
			unique : true
		},
		Date_Creation: {
			field : 'Date_Creation',
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		Id_Client: {
			field : 'Id_Client',
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		Id_Facture: {
			field : 'Id_Facture',
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
    }, {
		tableName : 'avoirs'
	})
    Avoirs.associate = models => {
        Avoirs.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
        Avoirs.belongsTo(models.Factures, { foreignKey : 'Id_Facture' })
    }

    return Avoirs
}
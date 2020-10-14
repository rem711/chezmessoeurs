'use strict';
module.exports = (sequelize, DataTypes) => {
    const Ventes = sequelize.define('Ventes', {
        Id_Vente: {
            field : 'Id_Vente',
            type : DataTypes.INTEGER(11),
            allowNull: false,
			primaryKey: true,
			autoIncrement: true
        },
        Id_Client: {
			field : 'Id_Client',
			type: DataTypes.INTEGER(11),
			allowNull: false
        },
        Description: {
            field : 'Description',
            type : DataTypes.TEXT,
            allowNull : false,
            defaultValue : ''
        },
        Date_Evenement: {
            field : 'Date_Evenement',
            type : DataTypes.DATE,
            allowNull : false,
        },
        Prix_TTC: {
			field : 'Prix_TTC',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
        },
        Nb_Personnes: {
			field : 'Nb_Personnes',
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
        },
        Ref_Devis: {
			field : 'Ref_Devis',
			type: DataTypes.STRING(100),
			allowNull: false,
			unique : true
		},
        Reste_A_Payer: {
			field : 'Reste_A_Payer',
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
    }, {
		tableName : 'ventes'
	})
    Ventes.associate = models => {
		Ventes.belongsTo(models.Clients, { foreignKey : 'Id_Client' })
    }

    return Ventes
}
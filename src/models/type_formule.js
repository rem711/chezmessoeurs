'use strict';
module.exports = (sequelize, DataTypes) => {
    const Type_Formule = sequelize.define('Type_Formule', {
        Id_Type_Formule: {
			field : 'Id_Type_Formule',
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			field : 'Nom',
			type: DataTypes.STRING(100),
			allowNull: false,
			validate : {
				isUndefined(value) {
					if(value === undefined || value === '') {
						throw new Error('Le nom ne peut pas être vide')
					}
				}
			},
			unique : {
				args : true,
				msg : 'Type de formule déjà existant.'
			}
		}
    }, {})
    Type_Formule.associate = models => {
        // Type_Formule.hasMany(models.Formules)
    }

    return Type_Formule
}
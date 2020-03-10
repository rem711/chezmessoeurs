'use strict';
module.exports = (sequelize, DataTypes) => {
    const Type_Formule = sequelize.define('Type_Formule', {
        Id_Type_Formule: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nom: {
			type: DataTypes.STRING(100),
			allowNull: false
		}
    }, {})
    Type_Formule.associate = models => {
        Type_Formule.hasMany(models.Formules)
    }

    return Type_Formule
}
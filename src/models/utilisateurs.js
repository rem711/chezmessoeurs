'use strict';
module.exports = (sequelize, DataTypes) => {
    const Utilisateurs = sequelize.define('Utilisateurs', {
        Id_Utilisateur: {
            field : 'Id_Utilisateur',
            type: DataTypes.UUID,
            defaultValue : DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        Login: {
            field : 'Login',
            type: DataTypes.STRING(50),
            allowNull: false,
            unique : true
        },
        Password: {
            field : 'Password',
            type: DataTypes.STRING(60),
            allowNull: false
        }
    }, {
        tableName : 'utilisateurs'
    });
    Utilisateurs.associate = function(models) {

    };
    return Utilisateurs;
};
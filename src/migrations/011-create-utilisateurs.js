'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Utilisateurs', {
            Id_Utilisateur: {
                field : 'Id_Utilisateur',
                type: Sequelize.UUID,
                defaultValue : Sequelize.UUIDV1,
                allowNull: false,
                primaryKey: true
            },
            Login: {
                field : 'Login',
                type: Sequelize.STRING(50),
                allowNull: false,
                unique : true
            },
            Password: {
                field : 'Password',
                type: Sequelize.STRING(60),
                allowNull: false
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Utilisateurs')
    }
}
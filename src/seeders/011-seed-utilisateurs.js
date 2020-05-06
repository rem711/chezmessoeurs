'use strict'

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Utilisateurs', [
            {
                Id_Utilisateur : '1d5c0da0-8fc7-11ea-b610-448a5b44f971',
                Login : 'test',
                Password : '$2a$08$XiuEV3wiv4GIwhXau7pLAOkEbUABYSc7zss3OCrm8XDuuVdvWIfPe'
            }
        ])
    },
    down : (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Utilisateurs', null, {})
    }
}
'use strict'

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Compteurs', [
            {
                Nom_Compteur : 'COMPTEUR_FACTURES_AVOIRS'
            },
            {
                Nom_Compteur : 'COMPTEUR_ACOMPTES'
            }
        ])
    },
    down : (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Compteurs', null, {})
    }
}
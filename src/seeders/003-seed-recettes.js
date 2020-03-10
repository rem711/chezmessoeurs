'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Recettes', [
        {
            Categorie : 'Salée',
            Nom : 'Gougère à l’Époisse',
            
        },
        {
            Categorie : 'Salée',
            Nom : 'Cannelé au chorizo',
            
        },
        {
            Categorie : 'Salée',
            Nom : 'Bun au sésame noir avec sa garniture du moment',
            
        },
        {
            Categorie : 'Salée',
            Nom : 'Verrine de tartare de légumes et sa brochette d’edamame',
            
        },
        {
            Categorie : 'Sucrée',
            Nom : 'Petit cake au citron',
            
        },
        {
            Categorie : 'Sucrée',
            Nom : 'Petit carrot cake',
            
        },
        {
            Categorie : 'Sucrée',
            Nom : 'Brochette de fruits frais',
            
        },
        {
            Categorie : 'Sucrée',
            Nom : 'Verrine de saison',
            
        },
        {
            Categorie : 'Boisson',
            Nom : 'Coca-Cola',
            
        },
        {
            Categorie : 'Boisson',
            Nom : 'Jus d\'orange'
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Recettes', null, {});
  }
};

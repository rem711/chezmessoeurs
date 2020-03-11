'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Prix_Unitaire', [
        {
            Nom_Type_Prestation : 'Pièce salée',
            IsOption : 0,
            Montant : 1.6
        },
        {
            Nom_Type_Prestation : 'Pièce sucrée',
            IsOption : 0,
            Montant : 1.45
        },
        {
            Nom_Type_Prestation : 'Petit brunch salé',
            IsOption : 0,
            Montant : 12.68
        },
        {
            Nom_Type_Prestation : 'Grand brunch salé',
            IsOption : 0,
            Montant : 20.86
        },
        {
            Nom_Type_Prestation : 'Petit brunch sucré',
            IsOption : 0,
            Montant : 6.96
        },
        {
            Nom_Type_Prestation : 'Grand brunch sucré',
            IsOption : 0,
            Montant : 11.36
        },
        {
            Nom_Type_Prestation : 'Box',
            IsOption : 0,
            Montant : 15
        },
        {
            Nom_Type_Prestation : 'Service sur-place',
            IsOption : 1,
            Montant : 120
        },
        {
            Nom_Type_Prestation : 'Livraison sur-place',
            IsOption : 1,
            Montant : 40
        },
        {
            Nom_Type_Prestation : 'Décoration florale',
            IsOption : 1,
            Montant : 70
        },
        
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Prix_Unitaire', null, {});
  }
};

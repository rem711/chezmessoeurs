'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Formules', [
        {
            Id_Type_Formule : 1,
            Nb_Convives : 6,
            Prix_HT : 38.4,
            Nb_Pieces_Salees : 4,
            Liste_Id_Recettes_Salees : '1;1;2;3;'
        },
        {
            Id_Type_Formule : 1,
            Nb_Convives : 6,
            Prix_HT : 38.4,
            Nb_Pieces_Salees : 4,
            Liste_Id_Recettes_Salees : '3;3;4;4;'
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Formules', null, {});
  }
};

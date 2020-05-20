'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Formules', [
        {
          Id_Formule : 1,
          Id_Type_Formule : 1,
          Nb_Convives : 6,
          Prix_HT : 38.4,
          Nb_Pieces_Salees : 4,
          Nb_Pieces_Sucrees : 0,
          Liste_Id_Recettes_Salees : '1;1;2;3;'
        },
        {
          Id_Formule : 2,
          Id_Type_Formule : 1,
          Nb_Convives : 6,
          Prix_HT : 38.4,
          Nb_Pieces_Salees : 4,
          Nb_Pieces_Sucrees : 0,
          Liste_Id_Recettes_Salees : '3;3;4;4;'
        },
        {
          Id_Formule : 3,
          Id_Type_Formule : 1,
          Nb_Convives : 9,
          Prix_HT : 100.8,
          Nb_Pieces_Salees : 7,
          Nb_Pieces_Sucrees : 0,
          Liste_Id_Recettes_Salees : '1;1;2;2;3;3;4;'
        },
        {
          Id_Formule : 4,
          Id_Type_Formule : 2,
          Nb_Convives : 9,
          Prix_HT : 168.75,
          Nb_Pieces_Salees : 9,
          Nb_Pieces_Sucrees : 3,
          Liste_Id_Recettes_Salees : '1;1;1;2;2;3;3;4;4;',
          Liste_Id_Recettes_Sucrees : '5;6;7;'
        },
        {
          Id_Formule : 5,
          Id_Type_Formule : 3,
          Nb_Convives : 9,
          Prix_HT : 135.0,
          Nb_Pieces_Salees : 3,
          Nb_Pieces_Sucrees : 1,
          Liste_Id_Recettes_Salees : '1;2;3;',
          Liste_Id_Recettes_Sucrees : '8;',
          Liste_Id_Recettes_Boissons : '10;'
        },
        {
          Id_Formule : 6,
          Id_Type_Formule : 4,
          Nb_Convives : 19,
          Prix_HT : 240.92,
          Nb_Pieces_Salees : 4,
          Nb_Pieces_Sucrees : 0,
          Liste_Id_Recettes_Salees : '',
          Liste_Id_Recettes_Sucrees : ''
        },
        {
          Id_Formule : 7,
          Id_Type_Formule : 4,
          Nb_Convives : 19,
          Prix_HT : 396.34,
          Nb_Pieces_Salees : 8,
          Nb_Pieces_Sucrees : 0,
          Liste_Id_Recettes_Salees : '',
          Liste_Id_Recettes_Sucrees : ''
        },
        {
          Id_Formule : 8,
          Id_Type_Formule : 4,
          Nb_Convives : 19,
          Prix_HT : 132.24,
          Nb_Pieces_Salees : 0,
          Nb_Pieces_Sucrees : 2,
          Liste_Id_Recettes_Salees : '',
          Liste_Id_Recettes_Sucrees : ''
        },
        {
          Id_Formule : 9,
          Id_Type_Formule : 4,
          Nb_Convives : 19,
          Prix_HT : 215.84,
          Nb_Pieces_Salees : 0,
          Nb_Pieces_Sucrees : 4,
          Liste_Id_Recettes_Salees : '',
          Liste_Id_Recettes_Sucrees : ''
        },
        {
          Id_Formule : 10,
          Id_Type_Formule : 4,
          Nb_Convives : 19,
          Prix_HT : 612.18,
          Nb_Pieces_Salees : 8,
          Nb_Pieces_Sucrees : 4,
          Liste_Id_Recettes_Salees : '1;1;1;2;2;3;3;4;',
          Liste_Id_Recettes_Sucrees : '5;6;7;8;'
        }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Formules', null, {});
  }
};

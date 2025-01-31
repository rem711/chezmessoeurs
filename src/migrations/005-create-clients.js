'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Clients', {
            Id_Client: {
                field : 'Id_Client',
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            Nom: {
                field : 'Nom',
                type: Sequelize.STRING(350),
                allowNull: false,
                validate : {
                    notNull : {
                        msg : 'Le nom doit être indiqué.'
                    },
                    len : {
                        args : [2, 350],
                        msg : 'Le nom ne peut pas contenir plus de 350 cractères.'
                    }
                }
            },
            Prenom: {
                field : 'Prenom',
                type: Sequelize.STRING(350),
                allowNull: false,
                validate : {
                    notNull : {
                        msg : 'Le prénom doit être indiqué.'
                    },
                    len : {
                        args : [2, 350],
                        msg : 'Le prénom ne peut pas contenir plus de 350 cractères.'
                    }
                }
            },
            Societe: {
                field : 'Societe',
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue : null,
                validate : {
                    len : {
                        args : [1, 500],
                        msg : 'Le nom de la société ne peut pas contenir plus de 500 cractères.'
                    }
                }
            },
            Adresse_Facturation_Adresse: {
                field : 'Adresse_Facturation_Adresse',
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue: '',
                validate : {
                    len : {
                        args : [0, 500],
                        msg : 'L\'adresse de facturation est limité à 500 caractères.'
                    }
                }
            },
            Adresse_Facturation_Adresse_Complement_1: {
                field : 'Adresse_Facturation_Adresse_Complement_1',
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue: '',
                validate : {
                    len : {
                        args : [0, 500],
                        msg : 'Le complément 1 d\'adresse de facturation est limité à 500 caractères.'
                    }
                }
            },
            Adresse_Facturation_Adresse_Complement_2: {
                field : 'Adresse_Facturation_Adresse_Complement_2',
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue: '',
                validate : {
                    len : {
                        args : [0, 500],
                        msg : 'Le complément 2 d\'adresse de facturation est limité à 500 caractères.'
                    }
                }
            },
            Adresse_Facturation_CP: {
                field : 'Adresse_Facturation_CP',
                type: Sequelize.STRING(5),
                allowNull: true,
                defaultValue: '00000',
                validate : {
                    isNumeric : {
                        msg : 'Le code postal doit être composé de 5 chiffres.'
                    },
                    len : {
                        args : [5, 5],
                        msg : 'Le code postal doit être composé de 5 chiffres.'
                    }
                }
            },
            Adresse_Facturation_Ville: {
                field : 'Adresse_Facturation_Ville',
                type: Sequelize.STRING(500),
                allowNull: true,
                defaultValue: '',
                validate : {
                    len : {
                        args : [0, 500],
                        msg : 'La ville de l\'adresse de facturation est limité à 500 caractères.'
                    }
                }
            },
            Numero_TVA : {
                field : 'Numero_TVA',
                type : Sequelize.STRING(13),
                allowNull : true,
                defaultValue : null,
                validate : {
                    len : {
                        args : [13, 13],
                        msg : 'Le numéro de TVA doit être un code à 13 caractères.'
                    },
                    is : {
                        args : /^FR[0-9]{2}[0-9]{9}$/ig,
                        msg : "Le numéro TVA doit être composé des lettres FR, suivie d'une clé à 2 chiffres et du numéro SIREN à 9 chiffres."
                    }
                }
            },
            Email: {
                field : 'Email',
                type: Sequelize.STRING(320),
                allowNull: false,
                validate : {
                    isEmail: {
                    msg : 'L\'adresse e-mail est incorrecte.'
                    },
                    notNull : {
                    msg : 'L\'adresse e-mail doit être renseignée.'
                    },
                    len : {
                    args : [6, 320],
                    msg : 'L\'adresse e-mail est incorrecte.'
                    }
                }
            },
            Telephone: {
                field : 'Telephone',
                type: Sequelize.STRING(10),
                allowNull: false,
                validate : {
                    notNull : {
                    msg : 'Le numéro de téléphone doit être renseigné.'
                    },
                            isPhoneNumber : value => {
                                if(!value.match(/[0-9]{10}/)) {
                                    throw new Error('Numéro de téléphone invalide')
                                }
                            }
                        }
                },
            Type: {
                field : 'Type',
                // type: Sequelize.STRING(13),
                type : Sequelize.ENUM('Professionnel', 'Particulier'),
                allowNull: false,
                defaultValue: 'Particulier',
                validate : {
                    notNull : {
                    msg : 'Le type doit être renseigné.'
                    },
                    isIn : {
                    args : [['Professionnel', 'Particulier']],
                    msg : 'Le type doit être Professionnel ou Particulier'
                    }
                }
            },
            Nombre_Prestations: {
                field : 'Nombre_Prestations',
                type: Sequelize.INTEGER(4).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            Dernier_Statut: {
                field : 'Dernier_Statut',
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue : null
            },
            Paiement_En_Retard: {
                field : 'Paiement_En_Retard',
                type: Sequelize.INTEGER(4).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Clients');
    }
};
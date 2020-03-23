const express = require('express')
const router = new express.Router()
const { Devis, Clients, Estimations, Formules, Recettes, Prix_Unitaire } = global.db
const { tableCorrespondanceTypes } = require('../utils/gestion_formules')
const { Op } = require('sequelize')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

const createDevis = async (estimation) => {
    const client = await Clients.findOne({
        where : {
            Id_Client : 8
        }
    })

    client.Dernier_Statut = 'test'
    client.save()
}

// prend une liste de devis, récupère et renvoie les infos utiles dans une liste de devis
const getListInfosDevis = async (listDevis) => {
    let listInfosDevis = []
    for(const d of listDevis) {
        const { Id_Devis, Client, Estimation, Date_Evenement, Id_Formule_Aperitif, Id_Formule_Cocktail, Id_Formule_Box, Id_Formule_Brunch, Commentaire } = d

        let Formule_Aperitif = null;
        let Formule_Cocktail = null;
        let Formule_Box = null;
        let Formule_Brunch = null;

        // récupération des formules
        if(Id_Formule_Aperitif !== null) {
            Formule_Aperitif = await Formules.findOne({
                where : {
                    Id_Formule : Id_Formule_Aperitif
                }
            })
        }
        if(Id_Formule_Cocktail !== null) {
            Formule_Cocktail = await Formules.findOne({
                where : {
                    Id_Formule : Id_Formule_Cocktail
                }
            })
        }
        if(Id_Formule_Box !== null) {
            Formule_Box = await Formules.findOne({
                where : {
                    Id_Formule : Id_Formule_Box
                }
            })
        }
        if(Id_Formule_Brunch) {
            Formule_Brunch = await Formules.findOne({
                where : {
                    Id_Formule : Id_Formule_Brunch
                }
            })
        }

         // mise à 0 si pas de formule
        const String_Formule_Aperitif = Formule_Aperitif === null ? 0 : Formule_Aperitif.Nb_Convives + ' / ' + Formule_Aperitif.Nb_Pieces_Salees
        const String_Formule_Cocktail = Formule_Cocktail === null ? 0 : Formule_Cocktail.Nb_Convives + ' / ' + Formule_Cocktail.Nb_Pieces_Salees + ' / ' + Formule_Cocktail.Nb_Pieces_Sucrees
        const String_Formule_Box = Formule_Box === null ? 0 : Formule_Box.Nb_Convives
        const String_Formule_Brunch = Formule_Brunch === null ? 0 : Formule_Brunch.Nb_Convives + ' / ' + Formule_Brunch.Nb_Pieces_Salees + ' / ' + Formule_Brunch.Nb_Pieces_Sucrees
        
        const devis = {
            Id_Devis,
            Client,
            Estimation,
            Date_Evenement,
            Commentaire,
            String_Formule_Aperitif,
            String_Formule_Cocktail,
            String_Formule_Box,
            String_Formule_Brunch
        }

        listInfosDevis.push(devis)
    }

    return listInfosDevis
}

router
// crée un devis
.post('/devis', (req, res) => {
    const devis = req.body
    res.render('devis', {
        titrePage : 'Création d\'un nouveau devis'
    })
})
// tableau devis
.get('/devis', async (req, res) => {
    // init les valeurs de retour
    const values = {
        'Général' : {
            infos : undefined
        },
        'En cours' : {
            infos : undefined,
            devis : undefined
        },
        'Envoyés' : {
            infos : undefined,
            devis : undefined
        },
        'Validés' : {   
            infos : undefined,
            devis : undefined
        }
    }

    // récupération des différentes listes de devis
    const temp_devisEnCours = await Devis.findAll({
        order : [
            ['Date_Evenement', 'ASC']
        ],
        where : {
            Statut : 'En cours'
        },
        include : [
            { model : Clients },
            { model : Estimations }
        ]
    })
    const temp_devisValidés = await Devis.findAll({
        order : [
            ['Date_Evenement', 'ASC']
        ],
        where : {
            Statut : 'Validé'
        },
        include : [
            { model : Clients },
            { model : Estimations }
        ]
    })
    const temp_devisEnvoyés = await Devis.findAll({
        order : [
            ['Date_Evenement', 'ASC']
        ],
        where : {
            Statut : 'Envoyé'
        },
        include : [
            { model : Clients },
            { model : Estimations }
        ]
    })

    // il y a un problème pour récupérer les devis
    if(temp_devisEnCours === null || temp_devisValidés === null || temp_devisEnvoyés === null) {
        values['Général'].infos = errorHandler('Une erreur s\'est produite, impossible de charger les devis.', undefined)        
    }
    else {
        // indique s'il n'y a pas de devis dans la catégorie
        if(temp_devisEnCours.length === 0) {
            values['En cours'].infos = errorHandler(undefined, 'Aucun devis')
        }
        if(temp_devisEnvoyés.length === 0) {
            values['Envoyés'].infos = errorHandler(undefined, 'Aucun devis')
        }
        if(temp_devisValidés.length === 0) {
            values['Validés'].infos = errorHandler(undefined, 'Aucun devis')
        }

        // récupération et formatage des informations des devis
        if(temp_devisEnCours.length > 0) {
            values['En cours'].devis = await getListInfosDevis(temp_devisEnCours)            
        }
        if(temp_devisEnvoyés.length > 0) {
            values['Envoyés'] = await getListInfosDevis(temp_devisEnvoyés)
        }
        if(temp_devisValidés.length > 0) {
            values['Validés'] = await getListInfosDevis(temp_devisValidés)
        }

    }

    res.render('index', {
        isDevis : true,
        values,
        moment,
        formatDateHeure
    })
})
// devis spécifique
.get('/devis/:Id_Devis', async (req, res) => {
    const getId = req.params.Id_Devis

    // init valeurs retour
    const values = { isDevisItem : true }
    let infos = undefined

    const devis = await Devis.findOne({
        where : {
            ID_Devis : getId
        },
        include : {
            all : true,
            nested : true
        }
    })

    // on verifie l'existence du devis
    if(devis !== null) { 
        // récupérations recettes sélectionnées
        let recettesSaleesAperitif = []
        let recettesBoissonsAperitif = []
        let recettesSaleesCocktail = []
        let recettesSucreesCocktail = []
        let recettesBoissonsCocktail = []
        let recettesSaleesBox = []
        let recettesSucreesBox = []
        let recettesBoissonsBox = []
        let recettesSaleesBrunch = []
        let recettesSucreesBrunch = []
        let recettesBoissonsBrunch = []

        if(devis.Formule_Aperitif) {
            let tabRecettesSalees = undefined
            let tabRecettesBoissons = undefined

            // récupération des recettes depuis les listes
            if(devis.Formule_Aperitif.Liste_Id_Recettes_Salees !== null) {
                tabRecettesSalees = devis.Formule_Aperitif.Liste_Id_Recettes_Salees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSalees.pop()

                // on crée une liste où on poussera les recettes
                recettesSaleesAperitif = []
                for(const Id_Recette of tabRecettesSalees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSaleesAperitif.push(recette)
                    }
                }

                for(const r of recettesSaleesAperitif) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Aperitif.Liste_Id_Recettes_Boissons !== null) {
                tabRecettesBoissons = devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesBoissons.pop()

                // on crée une liste où on poussera les recettes
                recettesBoissonsAperitif = []
                for(const Id_Recette of tabRecettesBoissons) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesBoissonsAperitif.push(recette)
                    }
                }
            }

        }
        if(devis.Formule_Cocktail) {
            let tabRecettesSalees = undefined
            let tabRecettesSucrees = undefined
            let tabRecettesBoissons = undefined

            // récupération des recettes depuis les listes
            if(devis.Formule_Cocktail.Liste_Id_Recettes_Salees !== null) {
                tabRecettesSalees = devis.Formule_Cocktail.Liste_Id_Recettes_Salees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSalees.pop()

                // on crée une liste où on poussera les recettes
                recettesSaleesCocktail = []
                for(const Id_Recette of tabRecettesSalees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSaleesCocktail.push(recette)
                    }
                }

                for(const r of recettesSaleesCocktail) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees !== null) {
                tabRecettesSucrees = devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSucrees.pop()

                // on crée une liste où on poussera les recettes
                recettesSucreesCocktail = []
                for(const Id_Recette of tabRecettesSucrees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSucreesCocktail.push(recette)
                    }
                }

                for(const r of recettesSucreesCocktail) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Cocktail.Liste_Id_Recettes_Boissons !== null) {
                tabRecettesBoissons = devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesBoissons.pop()

                // on crée une liste où on poussera les recettes
                recettesBoissonsCocktail = []
                for(const Id_Recette of tabRecettesBoissons) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesBoissonsCocktail.push(recette)
                    }
                }
            }
        }
        if(devis.Formule_Box) {
            let tabRecettesSalees = undefined
            let tabRecettesSucrees = undefined
            let tabRecettesBoissons = undefined

            // récupération des recettes depuis les listes
            if(devis.Formule_Box.Liste_Id_Recettes_Salees !== null) {
                tabRecettesSalees = devis.Formule_Box.Liste_Id_Recettes_Salees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSalees.pop()

                // on crée une liste où on poussera les recettes
                recettesSaleesBox = []
                for(const Id_Recette of tabRecettesSalees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSaleesBox.push(recette)
                    }
                }

                for(const r of recettesSaleesBox) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Box.Liste_Id_Recettes_Sucrees !== null) {
                tabRecettesSucrees = devis.Formule_Box.Liste_Id_Recettes_Sucrees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSucrees.pop()

                // on crée une liste où on poussera les recettes
                recettesSucreesBox = []
                for(const Id_Recette of tabRecettesSucrees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSucreesBox.push(recette)
                    }
                }

                for(const r of recettesSucreesBox) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Box.Liste_Id_Recettes_Boissons !== null) {
                tabRecettesBoissons = devis.Formule_Box.Liste_Id_Recettes_Boissons.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesBoissons.pop()

                // on crée une liste où on poussera les recettes
                recettesBoissonsBox = []
                for(const Id_Recette of tabRecettesBoissons) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesBoissonsBox.push(recette)
                    }
                }
            }
        }
        if(devis.Formule_Brunch) {
            let tabRecettesSalees = undefined
            let tabRecettesSucrees = undefined
            let tabRecettesBoissons = undefined

            // récupération des recettes depuis les listes
            if(devis.Formule_Brunch.Liste_Id_Recettes_Salees !== null) {
                tabRecettesSalees = devis.Formule_Brunch.Liste_Id_Recettes_Salees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSalees.pop()

                // on crée une liste où on poussera les recettes
                recettesSaleesBrunch = []
                for(const Id_Recette of tabRecettesSalees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSaleesBrunch.push(recette)
                    }
                }

                for(const r of recettesSaleesBrunch) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Brunch.Liste_Id_Recettes_Sucrees !== null) {
                tabRecettesSucrees = devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesSucrees.pop()

                // on crée une liste où on poussera les recettes
                recettesSucreesBrunch = []
                for(const Id_Recette of tabRecettesSucrees) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesSucreesBrunch.push(recette)
                    }
                }

                for(const r of recettesSucreesBrunch) {
                    console.log(r.Nom)
                }
            }
            if(devis.Formule_Brunch.Liste_Id_Recettes_Boissons !== null) {
                tabRecettesBoissons = devis.Formule_Brunch.Liste_Id_Recettes_Boissons.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabRecettesBoissons.pop()

                // on crée une liste où on poussera les recettes
                recettesBoissonsBrunch = []
                for(const Id_Recette of tabRecettesBoissons) {
                    const recette = await Recettes.findOne({
                        where : {
                            Id_Recette : Id_Recette
                        }
                    })
                    if(recette !== null) {
                        recettesBoissonsBrunch.push(recette)
                    }
                }
            }
        }

        let optionsSelectionnees = undefined
        let IdoptionsSelectionnees = []
        if(devis.Liste_Options !== null) {
            tabOptions = devis.Liste_Options.split(';')
            // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
            tabOptions.pop()

            // on crée une liste où on poussera les recettes
            optionsSelectionnees = []
            for(const Id_Option of tabOptions) {
                const option = await Prix_Unitaire.findOne({
                    where : {
                        Id_Prix_Unitaire : Id_Option
                    }
                })
                if(option !== null) {
                    optionsSelectionnees.push(option)
                    IdoptionsSelectionnees.push(option.Id_Prix_Unitaire)
                }
            }
        }

        // récupération des recettes
        const listeRecettesSalees = await Recettes.findAll({
            where : {
                Categorie : 'Salée'
            }
        })
        const listeRecettesSucrees = await Recettes.findAll({
            where : {
                Categorie : 'Sucrée'
            }
        })
        const listeRecettesBoissons = await Recettes.findAll({
            where : {
                Categorie : 'Boisson'
            }
        })

        // récupération des options
        const listeOptions = await Prix_Unitaire.findAll({
            where : {
                isOption : true,
                Id_Prix_Unitaire : {
                    [Op.notIn] : IdoptionsSelectionnees
                }
            }
        })

        // récupération des différents prix
        const listePrix_unitaire = await Prix_Unitaire.findAll({}) 

        // affectation des valeurs de retour
        values.recettesSaleesAperitif = recettesSaleesAperitif
        values.recettesBoissonsAperitif = recettesBoissonsAperitif
        values.recettesSaleesCocktail = recettesSaleesCocktail
        values.recettesSucreesCocktail = recettesSucreesCocktail
        values.recettesBoissonsCocktail = recettesBoissonsCocktail
        values.recettesSaleesBox = recettesSaleesBox
        values.recettesSucreesBox = recettesSucreesBox
        values.recettesBoissonsBox = recettesBoissonsBox
        values.recettesSaleesBrunch = recettesSaleesBrunch
        values.recettesSucreesBrunch = recettesSucreesBrunch
        values.recettesBoissonsBrunch = recettesBoissonsBrunch
        values.optionsSelectionnees = optionsSelectionnees
        values.listeRecettesSalees = listeRecettesSalees
        values.listeRecettesSucrees = listeRecettesSucrees
        values.listeRecettesBoissons = listeRecettesBoissons
        values.listeOptions = listeOptions
        values.listePrix_unitaire = listePrix_unitaire
    }
    else {
        infos = errorHandler(`Le devis n°${getId} n'existe pas.`)
    }

    values.infos = infos
    values.devis = devis
    values.tableCorrespondanceTypes = tableCorrespondanceTypes
    values.moment = moment

    // res.render('index', values)

    const ejs = require('ejs')
    
    // essaie de rendu en amont pour un chargement de la page plus rapide
    ejs.renderFile(__dirname + '/../views/index.html', values, (err, html) => {
        if(!err) {
            res.send(html)
        }
        else {
            infos = errorHandler(err, undefined)
            res.render('index', values)
        }
    })
})
// modifie un devis
.patch('/devis/:id', (req, res) => {
    const idDevis = req.params.id
    res.render('devis', {
        titrePage : `Modification du devis n° ${idDevis}`
    })
})
.delete('/devis/:id', (req, res) => {
    const idDevis = req.params.id
    res.render('devis', {
        titrePage : `Suppression du devis n° ${idDevis}`
    })
})

module.exports = {
    router,
    createDevis
}
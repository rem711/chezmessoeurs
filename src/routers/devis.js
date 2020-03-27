const express = require('express')
const router = new express.Router()
const ejs = require('ejs')
const { Devis, Clients, Estimations, Formules, Recettes, Prix_Unitaire } = global.db
const { tableCorrespondanceTypes, modifyFormule } = require('../utils/gestion_formules')
const { checksListeOptions } = require('../utils/gestion_prix_unitaire')
const { Op } = require('sequelize')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

const createDevis = async (estimation = undefined) => {
    let devis = undefined
    let hasEstimation = true

    try {
        // cas où le devis est créé directement, en dehors d'une estimation
        // TODO:Création devis en dehors d'une estimation
        if(estimation === undefined) {
            hasEstimation = false
            estimation = {
                
            }
        }

        try {
            // gestion des prix
            let prixHT = 0
            let prixTTC = 0

            if(estimation.Formule_Aperitif !== null) {
                prixHT += estimation.Formule_Aperitif.Prix_HT
            }
            if(estimation.Formule_Cocktail !== null) {
                prixHT += estimation.Formule_Cocktail.Prix_HT
            }
            if(estimation.Formule_Box !== null) {
                prixHT += estimation.Formule_Box.Prix_HT
            }
            if(estimation.Formule_Brunch !== null) {
                prixHT += estimation.Formule_Brunch.Prix_HT
            }

            prixTTC = prixHT * 1.1

            // création du devis
            devis = await Devis.create({
                Id_Estimation : estimation.Id_Estimation,
                Id_Client : estimation.Id_Client,
                Date_Evenement : estimation.Date_Evenement,
                Adresse_Livraison : estimation.Client.Adresse_Facturation,
                Id_Formule_Aperitif : estimation.Id_Formule_Aperitif,
                Id_Formule_Cocktail : estimation.Id_Formule_Cocktail,
                Id_Formule_Box : estimation.Id_Formule_Box,
                Id_Formule_Brunch : estimation.Id_Formule_Brunch,
                Commentaire : estimation.Commentaire,
                Statut : 'En cours',
                Prix_HT : prixHT,
                Prix_TTC : prixTTC
            })

            // on archive l'estimation
            estimation.Statut = 'Archivé'
            estimation.save()

            // on met à jour le statut du client
            estimation.Client.Dernier_Statut = 'Devis en cours'
            estimation.Client.save()
        }
        catch(error) {
            throw error.errors[0].message
        }
    }
    catch(error) {
        throw error
    }

    return devis
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
// crée un devis sans estimation existente
.get('/devis/create', async (req, res) => {
    let infos = undefined

    const devis = {
        Date_Evenement : moment.utc(),
        Client : {
            Id_Client : '',
            Type : 'Particulier'
        },
        Formule_Aperitif : null,
        Formule_Cocktail : null,
        Formule_Box : null,
        Formule_Brunch : null
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
            isOption : true
        }
    })

    // récupération des différents prix
    const listePrix_unitaire = await Prix_Unitaire.findAll({}) 

    const values = {
        isDevisItem : true,
        infos,
        devis,
        moment,
        tableCorrespondanceTypes,
        listeRecettesSalees,
        listeRecettesSucrees,
        listeRecettesBoissons,
        listeOptions,
        listePrix_unitaire,
        isCreation : true
    }


    ejs.renderFile(__dirname + '/../views/index.html', values, (err, html) => {
        if(!err) {
            res.send(html)
        }
        else {
            infos = errorHandler(err, undefined)
            res.render('index', values)
        }
    })
    
    // res.render('index', {
    //     isDevisItem : true,
    //     infos,
    //     devis,
    //     moment,
    //     tableCorrespondanceTypes
    // })
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
            Id_Devis : getId
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
// TODO:Devis vers facture
// valide un devis pour créer une facture
.post('/devis/validation/:Id_Devis', async (req, res) => {

})
// TODO:Update devis
// modifie un devis
.patch('/devis/:Id_Devis', async (req, res) => {
    const postIdDevis = req.params.Id_Devis
    const body = req.body

    console.log('************************************')
    console.log('id : ', postIdDevis)
    console.log('body : ', body)
    console.log('************************************')

    let infos = undefined
    let devis = undefined

    // on vérifie si l'on est dans le cas d'une création sans estimation
    if((postIdDevis === undefined || postIdDevis === 'undefined') && body.isCreation) {

    }
    // cas classique
    else if(postIdDevis !== undefined && postIdDevis !== 'undefined') {
        devis = await Devis.findOne({
            where : {
                Id_Devis : postIdDevis
            },
            include : [
                { model : Clients },
                { model : Formules, as : 'Formule_Aperitif' },
                { model : Formules, as : 'Formule_Cocktail' },
                { model : Formules, as : 'Formule_Box' },
                { model : Formules, as : 'Formule_Brunch' }
            ]
        })

        if(devis !== null) {
            try {
                // vérification des formules
                let Id_Formule_Aperitif = null
                let Id_Formule_Cocktail = null
                let Id_Formule_Box = null
                let Id_Formule_Brunch = null

                if(body.Formule_Aperitif.isAperitif) {
                    // on vérifie que nos listes se terminent par un ';'
                    if(body.Formule_Aperitif.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Aperitif.Liste_Id_Recettes_Salees[body.Formule_Aperitif.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                        body.Formule_Aperitif.Liste_Id_Recettes_Salees += ';'
                    }
                    if(body.Formule_Aperitif.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Aperitif.Liste_Id_Recettes_Boissons[body.Formule_Aperitif.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                        body.Formule_Aperitif.Liste_Id_Recettes_Boissons += ';'
                    }

                    // vérification d'une modification de la formule
                    if(devis.Formule_Aperitif === null || devis.Formule_Aperitif.Nb_Convives != body.Formule_Aperitif.Nb_Convives ||
                        devis.Formule_Aperitif.Nb_Pieces_Salees != body.Formule_Aperitif.Nb_Pieces_Salees ||
                        devis.Formule_Aperitif.Liste_Id_Recettes_Salees !== body.Formule_Aperitif.Liste_Id_Recettes_Salees ||
                        devis.Formule_Aperitif.Liste_Id_Recettes_Boissons !== body.Formule_Aperitif.Liste_Id_Recettes_Boissons) 
                    {
                        const modifs = await modifyFormule(devis.Formule_Aperitif, body.Formule_Aperitif)
                        infos = modifs.infos
                        if(modifs.formule !== undefined) {
                            Id_Formule_Aperitif = modifs.formule.Id_Formule
                        }
                    }
                    // s'il n'y avait pas de formule Aperitif ou s'il n'y a pas de différence, on assigne simplement l'ID existant
                    else {
                        Id_Formule_Aperitif = devis.Id_Formule_Aperitif
                    }
                }
                if(body.Formule_Cocktail.isCocktail) {
                    // on vérifie que nos listes se terminent par un ';'
                    if(body.Formule_Cocktail.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Salees[body.Formule_Cocktail.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                        body.Formule_Cocktail.Liste_Id_Recettes_Salees += ';'
                    }
                    if(body.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Sucrees[body.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                        body.Formule_Cocktail.Liste_Id_Recettes_Sucrees += ';'
                    }
                    if(body.Formule_Cocktail.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Boissons[body.Formule_Cocktail.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                        body.Formule_Cocktail.Liste_Id_Recettes_Boissons += ';'
                    }

                    // vérification d'une modification de la formule
                    if(devis.Formule_Cocktail === null || devis.Formule_Cocktail.Nb_Convives != body.Formule_Cocktail.Nb_Convives ||
                        devis.Formule_Cocktail.Nb_Pieces_Salees != body.Formule_Cocktail.Nb_Pieces_Salees ||
                        devis.Formule_Cocktail.Nb_Pieces_Sucrees != body.Formule_Cocktail.Nb_Pieces_Sucrees ||
                        devis.Formule_Cocktail.Liste_Id_Recettes_Salees !== body.Formule_Cocktail.Liste_Id_Recettes_Salees ||
                        devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees !== body.Formule_Cocktail.Liste_Id_Recettes_Sucrees ||
                        devis.Formule_Cocktail.Liste_Id_Recettes_Boissons !== body.Formule_Cocktail.Liste_Id_Recettes_Boissons) 
                    {
                        const modifs = await modifyFormule(devis.Formule_Cocktail, body.Formule_Cocktail)
                        infos = modifs.infos
                        if(modifs.formule !== undefined) {
                            Id_Formule_Cocktail = modifs.formule.Id_Formule
                        }
                    }
                    // s'il n'y avait pas de formule Cocktail ou s'il n'y a pas de différence, on assigne simplement l'ID existant
                    else {
                        Id_Formule_Cocktail = devis.Id_Formule_Cocktail
                    }
                }
                if(body.Formule_Box.isBox) {
                    if(body.Formule_Box.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Box.Liste_Id_Recettes_Salees[body.Formule_Box.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                        body.Formule_Box.Liste_Id_Recettes_Salees += ';'
                    }
                    if(body.Formule_Box.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Box.Liste_Id_Recettes_Sucrees[body.Formule_Box.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                        body.Formule_Box.Liste_Id_Recettes_Sucrees += ';'
                    }
                    if(body.Formule_Box.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Box.Liste_Id_Recettes_Boissons[body.Formule_Box.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                        body.Formule_Box.Liste_Id_Recettes_Boissons += ';'
                    }

                    // vérification d'une modification de la formule
                    if(devis.Formule_Box === null || devis.Formule_Box.Nb_Convives != body.Formule_Box.Nb_Convives ||
                        devis.Formule_Box.Liste_Id_Recettes_Salees !== body.Formule_Box.Liste_Id_Recettes_Salees ||
                        devis.Formule_Box.Liste_Id_Recettes_Sucrees !== body.Formule_Box.Liste_Id_Recettes_Sucrees ||
                        devis.Formule_Box.Liste_Id_Recettes_Boissons !== body.Formule_Box.Liste_Id_Recettes_Boissons) 
                    {
                        const modifs = await modifyFormule(devis.Formule_Box, body.Formule_Box)
                        infos = modifs.infos
                        if(modifs.formule !== undefined) {
                            Id_Formule_Box = modifs.formule.Id_Formule
                        }
                    }
                    // s'il n'y avait pas de formule Box ou s'il n'y a pas de différence, on assigne simplement l'ID existant
                    else {
                        Id_Formule_Box = devis.Id_Formule_Box
                    }
                }
                if(body.Formule_Brunch.isBrunch) {
                    if(body.Formule_Brunch.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Salees[body.Formule_Brunch.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                        body.Formule_Brunch.Liste_Id_Recettes_Salees += ';'
                    }
                    if(body.Formule_Brunch.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Sucrees[body.Formule_Brunch.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                        body.Formule_Brunch.Liste_Id_Recettes_Sucrees += ';'
                    }
                    if(body.Formule_Brunch.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Boissons[body.Formule_Brunch.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                        body.Formule_Brunch.Liste_Id_Recettes_Boissons += ';'
                    }

                    // vérification d'une modification de la formule
                    if(devis.Formule_Brunch === null || devis.Formule_Brunch.Nb_Convives != body.Formule_Brunch.Nb_Convives ||
                        devis.Formule_Brunch.Nb_Pieces_Salees != body.Formule_Brunch.Nb_Pieces_Salees ||
                        devis.Formule_Brunch.Nb_Pieces_Sucrees != body.Formule_Brunch.Nb_Pieces_Sucrees ||
                        devis.Formule_Brunch.Liste_Id_Recettes_Salees !== body.Formule_Brunch.Liste_Id_Recettes_Salees ||
                        devis.Formule_Brunch.Liste_Id_Recettes_Sucrees !== body.Formule_Brunch.Liste_Id_Recettes_Sucrees ||
                        devis.Formule_Brunch.Liste_Id_Recettes_Boissons !== body.Formule_Brunch.Liste_Id_Recettes_Boissons) 
                    {
                        const modifs = await modifyFormule(devis.Formule_Brunch, body.Formule_Brunch)
                        infos = modifs.infos
                        if(modifs.formule !== undefined) {
                            Id_Formule_Brunch = modifs.formule.Id_Formule
                        }
                    }
                    // s'il n'y avait pas de formule Brunch ou s'il n'y a pas de différence, on assigne simplement l'ID existant
                    else {
                        Id_Formule_Brunch = devis.Id_Formule_Brunch
                    }
                }

                // vérification des options
                if(devis.Liste_Options !== body.Liste_Options) {
                    if(body.Liste_Options.length > 1 && body.Liste_Options[body.Liste_Options.length - 1] !== ';') {
                        body.Liste_Options += ';'
                    }
                    body.Liste_Options = await checksListeOptions(body.Liste_Options)
                }


                // màj des infos client
                devis.Client.Nom_Prenom = body.client.Nom_Prenom.trim()
                devis.Client.Adresse_Facturation = body.client.Adresse_Facturation.trim()
                devis.Client.Email = body.client.Email.trim()
                devis.Client.Telephone = body.client.Telephone.trim()
                devis.Client.Type = body.client.Type

                devis.Date_Evenement = moment.utc(body.Date_Evenement)
                devis.Adresse_Livraison = body.Adresse_Livraison.trim()
                devis.Commentaire = body.Commentaire.trim()
                devis.Liste_Options = body.Liste_Options
                devis.Id_Remise = body.Id_Remise
                devis.Id_Formule_Aperitif = Id_Formule_Aperitif
                devis.Id_Formule_Cocktail = Id_Formule_Cocktail
                devis.Id_Formule_Box = Id_Formule_Box
                devis.Id_Formule_Brunch = Id_Formule_Brunch


                // faire les save ici si tout ok
                if(infos === undefined || !infos.error) {
                    devis.save()
                    devis.Client.save()
                }
            }
            catch(error) {
                infos = errorHandler(error, undefined)
            }
        }
        else {
            infos = errorHandler('Le devis n\'existe pas.', undefined)
        }
    }
    else {
        infos = errorHandler('Une erreur s\'est produite, veuillez réessayer plus tard', undefined)
    }

    if(infos === undefined || !infos.error) {
        infos = errorHandler(undefined, 'Le devis a bien été modifié.')
    }

    res.send({
        infos
    })
})
// FIXME:Archive devis
// archive un devis
.patch('/devis/archive/:Id_Devis', async (req, res) => {
    const postIdDevis = req.params.Id_Devis
    let infos = undefined

    const devis = await Devis.findOne({
        where : {
            Id_Devis : postIdDevis
        }
    })

    if(devis !== null) {
        devis.Statut = 'Archivé'
        devis.save()

        await Clients.update(
            {
                Dernier_Statut : 'Devis archivé'
            },
            {
                where : {
                    Id_Client : devis.Id_Client
                }
            }
        )

        infos = errorHandler(undefined, 'Le devis a bien été archivé')
    }
    else {
        infos = errorHandler('Le devis n\'existe pas', undefined)
    }

    res.send({
        infos
    })
})
// FIXME:Delete devis
.delete('/devis/:Id_Devis', async (req, res) => {
    const postIdDevis = req.params.Id_Devis

    let infos = undefined

    try {
        const devis = await Devis.findOne({
            where : {
                Id_Devis : postIdDevis
            }
        })

        if(devis !== null) {
            await devis.destroy()
            infos = errorHandler(undefined, 'Le devis a bien été supprimé.')
        }
        else {
            infos = errorHandler('Le devis n\'existe pas.', undefined)
        }
    }
    catch(error) {
        infos = errorHandler(error, undefined)
    }

    res.send({
        infos
    })
})

module.exports = {
    router,
    createDevis
}
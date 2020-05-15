const express = require('express')
const router = new express.Router()
const { Recettes } = global.db
const { Op } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')

router
// carte
.get('/carte', async (req, res) => {
    let infos = undefined
    let recettes = {
        Salees : {
            infos : undefined,
            recettes : []
        },
        Sucrees : {
            infos : undefined,
            recettes : []
        },
        Boissons : {
            infos : undefined,
            recettes : []
        }
    }

    try {
        const salees = await Recettes.findAll({
            where : {
                Categorie : 'Salée',
                Visible : 1
            },
            order : [['Disponible', 'DESC']]
        })

        if(salees === null) {
            throw "Une erreur est survenue, impossible de charger les recettes."
        }
        if(salees.length === 0) {
            recettes.Salees.infos = clientInformationObject("Aucune recette")
        }

        recettes.Salees.recettes = salees

        const sucrees = await Recettes.findAll({
            where : {
                Categorie : 'Sucrée',
                Visible : 1
            },
            order : [['Disponible', 'DESC']]
        })

        if(sucrees === null) {
            throw "Une erreur est survenue, impossible de charger les recettes."
        }
        if(sucrees.length === 0) {
            recettes.Sucrees.infos = clientInformationObject("Aucune recette")
        }

        recettes.Sucrees.recettes = sucrees

        const boissons = await Recettes.findAll({
            where : {
                Categorie : 'Boisson',
                Visible : 1
            },
            order : [['Disponible', 'DESC']]
        })

        if(boissons === null) {
            throw "Une erreur est survenue, impossible de charger les recettes."
        }
        if(boissons.length === 0) {
            recettes.Boissons.infos = clientInformationObject("Aucune recette")
        }

        recettes.Boissons.recettes = boissons
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.render('index', {
        isCarte : true,
        infos,
        recettes
    })
})
.get('/carte/recettes/:Id_Recette', async (req, res) => {
    const postIdRecette = Number(req.params.Id_Recette)
    let infos = undefined
    let recette = undefined

    try {
        if(isNaN(postIdRecette) || postIdRecette < 1) {
            throw "Identifiant recette incorrect."
        }

        recette = await Recettes.findOne({
            where : {
                Id_Recette : postIdRecette,
                Visible : 1
            }
        })

        if(recette === null) {
            throw "La recette n'existe pas."
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        recette
    })
})
.post('/carte/recettes', async (req, res) => {
    const body = req.body
    body.Disponible = Number(body.Disponible)
    let infos = undefined
    let recette = undefined

    try {
        if(!isSet(body.Categorie)) {
            throw "Une catégorie doit être sélectionnée."
        }
        if(!isSet(body.Nom)) {
            throw "Le nom de la recette doit être renseignée."
        }
        if(!isSet(body.Disponible) || isNaN(body.Disponible)) {
            throw "La disponibilité de la recette doit être renseignée."
        }

        if(!isSet(body.Description)) {
            body.Description = ''
        }

        recette = await Recettes.create({
            Categorie : body.Categorie,
            Nom : body.Nom,
            Description : body.Description,
            Disponible : body.Disponible
        })

        if(recette === null) {
            throw "Une erreur est survenue, la recette n'a pas pu être créée."
        }

        infos = clientInformationObject(undefined, "La recette a bien été créée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        recette
    })
})
.patch('/carte/recettes/:Id_Recette', async (req, res) => {
    const postIdRecette = Number(req.params.Id_Recette)
    const body = req.body
    body.Disponible = Number(body.Disponible)
    let infos = undefined
    let recette = undefined

    try {
        if(isNaN(postIdRecette) || postIdRecette < 1) {
            throw "L'identifiant de la recette est incorrect."
        }

        recette = await Recettes.findOne({
            where : {
                Id_Recette : postIdRecette
            }
        })

        if(recette === null) {
            throw "La recette demandée n'existe pas."
        }
        if(recette.Visible === 0) {
            throw "La recette demandée n'est plus disponible."
        }
        if(!isSet(body.Categorie)) {
            throw "Une catégorie doit être sélectionnée."
        }
        if(!isSet(body.Nom)) {
            throw "Le nom de la recette doit être renseignée."
        }
        if(!isSet(body.Disponible) || isNaN(body.Disponible)) {
            throw "La disponibilité de la recette doit être renseignée."
        }

        if(!isSet(body.Description)) {
            body.Description = ''
        }

        if(recette.Categorie !== body.Categorie || recette.Nom !== body.Nom || recette.Disponible !== body.Disponible) {
            recette.Categorie = body.Categorie
            recette.Nom = body.Nom
            recette.Disponible = body.Disponible

            recette.save()
        }

        infos = clientInformationObject(undefined, "La recette a bien été modifiée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        recette
    })
})
.delete('/carte/recettes/:Id_Recette', async (req, res) => {
    const postIdRecette = Number(req.params.Id_Recette)
    let infos = undefined
    let recette = undefined

    try {
        if(isNaN(postIdRecette) || postIdRecette < 1) {
            throw "L'identifiant de la recette est incorrecte."
        }

        recette = await Recettes.findOne({
            where : {
                Id_Recette : postIdRecette,
                Visible : 1
            }
        })

        if(recette === null) {
            throw "La recette n'existe pas."
        }

        recette.Visible = 0
        recette.save()

        infos = clientInformationObject(undefined, "La recette a bien été supprimée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        recette
    })
})

module.exports = router
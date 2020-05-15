const express = require('express')
const router = new express.Router()
const { Prix_Unitaire } = global.db
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')

router
.get('/prix&options', async (req, res) => {
    let infos = undefined
    const prix = {
        Menus : {
            infos : undefined,
            items : undefined
        },
        Options : {
            infos : undefined,
            items : undefined
        }
    }

    try {
        const menus = await Prix_Unitaire.findAll({
            where : {
                IsOption : 0
            },
            order : [['Nom_Type_Prestation', 'ASC']]
        })

        if(menus === null) {
            throw "Une erreur est survenue, impossible de charger les menus."
        }

        if(menus.length === 0) {
            prix.Menus.infos = clientInformationObject("Aucun menu disponible", undefined)
        }

        prix.Menus.items = menus

        const options = await Prix_Unitaire.findAll({
            where : {
                IsOption : 1
            },
            order : [['Nom_Type_Prestation', 'ASC']]
        })

        if(options === null) {
            throw "Une erreur est survenue, impossible de charger les options."
        }

        if(options.length === 0) {
            prix.Options.infos = clientInformationObject("Aucune option disponible", undefined)
        }

        prix.Options.items = options
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }
    
    return res.render('index', {
        isPrix : true,
        infos,
        prix
    })
})
.get('/prix&options/menu/:Id_Menu', async (req, res) => {
    const postIdMenu = Number(req.params.Id_Menu)
    let infos = undefined
    let menu = undefined

    try {
        if(isNaN(postIdMenu) || postIdMenu < 1) {
            throw "Identifiant menu incorrect."
        }

        menu = await Prix_Unitaire.findOne({
            where : {
                Id_Prix_Unitaire : postIdMenu,
                IsOption : 0
            }
        })

        if(menu === null) {
            throw "Le menu n'existe pas."
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        menu
    })
})
.get('/prix&options/option/:Id_Option', async (req, res) => {
    const postIdOption = Number(req.params.Id_Option)
    let infos = undefined
    let option = undefined

    try {
        if(isNaN(postIdOption) || postIdOption < 1) {
            throw "Identifiant option incorrect."
        }

        option = await Prix_Unitaire.findOne({
            where : {
                Id_Prix_Unitaire : postIdOption,
                IsOption : 1
            }
        })

        if(option === null) {
            throw "L'option n'existe pas."
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        option
    })
})
.post('/prix&options/option', async (req, res) => {
    const body = req.params.body
    let infos = undefined
    let option = undefined

    try {
        if(!isSet(body.Nom_Type_Prestation)) {
            throw "Le nom doit être défini."
        }
        if(!isSet(body.Montant)) {
            throw "Le montant doit être défini."
        }

        body.Montant = Number(Number(body.Montant).toFixed(2))
        if(isNaN(body.Montant)) {
            throw "Le montant doit être défini."
        }

        option = await Prix_Unitaire.create({
            Nom_Type_Prestation : body.Nom_Type_Prestation,
            Montant : body.Montant,
            IsOption : 1
        })

        infos = clientInformationObject(undefined, "L'option a bien été créée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        option
    })
})
.patch('/prix&options/menu/:Id_Menu', async (req, res) => {
    const postIdMenu = Number(req.params.Id_Menu)
    const body = req.body
    let infos = undefined
    let menu = undefined

    try {
        if(isNaN(postIdMenu) || postIdMenu < 1) {
            throw "Identifiant menu incorrect."
        }

        if(!isSet(body.Nom_Type_Prestation)) {
            throw "Le nom doit être défini."
        }
        if(!isSet(body.Montant)) {
            throw "Le montant doit être défini."
        }

        body.Montant = Number(Number(body.Montant).toFixed(2))
        if(isNaN(body.Montant)) {
            throw "Le montant doit être défini."
        }

        menu = await Prix_Unitaire.findOne({
            where : {
                Id_Prix_Unitaire : postIdMenu,
                IsOption : 0
            }
        })

        if(menu === null) {
            throw "Le menu n'existe pas."
        }

        if(body.Nom_Type_Prestation !== menu.Nom_Type_Prestation || body.Montant !== menu.Montant) {
            menu.Nom_Type_Prestation = body.Nom_Type_Prestation
            menu.Montant = body.Montant

            menu.save()
        }

        infos = clientInformationObject(undefined, "Le menu a bien été modifié.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        menu
    })
})
.patch('/prix&options/option/:Id_Option', async (req, res) => {
    const postIdOption = Number(req.params.Id_Option)
    const body = req.body
    let infos = undefined
    let option = undefined

    try {
        if(isNaN(postIdOption) || postIdOption < 1) {
            throw "Identifiant option incorrect."
        }

        if(!isSet(body.Nom_Type_Prestation)) {
            throw "Le nom doit être défini."
        }
        if(!isSet(body.Montant)) {
            throw "Le montant doit être défini."
        }

        body.Montant = Number(Number(body.Montant).toFixed(2))
        if(isNaN(body.Montant)) {
            throw "Le montant doit être défini."
        }

        option = await Prix_Unitaire.findOne({
            where : {
                Id_Prix_Unitaire : postIdOption,
                IsOption : 1
            }
        })

        if(option === null) {
            throw "L'option n'existe pas."
        }

        if(body.Nom_Type_Prestation !== option.Nom_Type_Prestation || body.Montant !== option.Montant) {
            option.Nom_Type_Prestation = body.Nom_Type_Prestation
            option.Montant = body.Montant

            option.save()
        }

        infos = clientInformationObject(undefined, "L'option a bien été modifiée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        option
    })
})

module.exports = router
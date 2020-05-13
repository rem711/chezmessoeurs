const express = require('express')
const router = new express.Router()
const { Avoirs, Factures, Devis, Clients, Prix_Unitaire } = global.db
const { Op } = require("sequelize")
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const compteurs = require('../utils/compteurs')
const formatNumeroAvoir = require('../utils/numeroFormatter')
const createPDFAvoir = require('../utils/pdf/pdf_avoirs')
const moment = require('moment')

const createAvoir = async (facture) => {
    if(!(facture instanceof Factures)) {
        throw "La facture est incorrecte, impossible de créer l'avoir."
    }

    const avoir = await Avoirs.create({
        Numero_Avoir : `AV_${moment.utc().format('YYYYMMDD')}_****_${facture.Client.Nom.toUpperCase()}`,
        Id_Client : facture.Id_Client,
        Id_Facture : facture.Id_Facture
    })

    if(avoir !== null) {
        // màj Numero_Avoir
        const numero = await compteurs.get(compteurs.COMPTEUR_FACTURES_AVOIRS)
        avoir.Numero_Avoir = avoir.Numero_Avoir.replace(/(\*){4}/g, formatNumeroAvoir(numero))
        avoir.save()
    }

    return avoir
}

router
// Route tampon pour la création d'un avoir lors de l'annulation d'une facture. Récupère les valeurs nécessaires et les passe à la route de génération du pdf (avec l'url formatée)
.get('/avoirs/generate/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    let facture = undefined
    let avoir = undefined

    try {
        if(isNaN(postIdFacture) || postIdFacture < 1) {
            throw "L'identifiant de la facture est incorrect, impossible d'accéder à l'avoir."
        }

        facture = await Factures.findOne({
            where : {
                Id_Facture : postIdFacture
            }
        })

        if(facture === null) {
            throw "L'identifiant de la facture est incorrect, impossible d'accéder à l'avoir."
        }
        if(facture.Statut !== 'Annulée') {
            throw "Cette facture n'est pas annulée, son avoir n'est donc pas disponible."
        }

        avoir = await Avoirs.findOne({
            where : {
                Id_Facture : facture.Id_Facture
            },
            include : {
                all : true,
                nested : true
            }
        })

        if(avoir === null) {
            throw "Il n'existe pas d'avoir pour cette facture."
        }

        // tout est bon
        req.session.avoir = avoir
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)

        return res.send(infos.error)
    }

    res.redirect(`/avoirs/pdf/${encodeURI('CHEZ MES SOEURS - Facture d\'Avoir ')}${avoir.Numero_Avoir}.pdf`)
})

.get(`/avoirs/pdf/${encodeURI('CHEZ MES SOEURS - Facture d\'Avoir ')}:Numero_Avoir.pdf`, async (req, res) => {
    const postNumeroAvoir = req.params.Numero_Avoir
    let avoir = undefined

    try {
        if(req.session.avoir !== undefined) {
            avoir = req.session.avoir
            req.session.avoir = undefined
        }
        else {
            avoir = await Avoirs.findOne({
                where : {
                    Numero_Avoir : postNumeroAvoir
                },
                include : {
                    all : true,
                    nested : true
                }
            })
        }

        if(avoir === null) {
            throw "Le numéro de l'avoir est incorrect ou celui-ci n'existe pas."
        }
        if(postNumeroAvoir !== avoir.Numero_Avoir) {
            throw "Le numéro de l'avoir est incorrect."
        }

        const toPDF = {
            Facture : {}
        }
        toPDF.Numero_Avoir = avoir.Numero_Avoir
        toPDF.Facture.Id_Facture = avoir.Facture.Id_Facture
        toPDF.Facture.Numero_Facture = avoir.Facture.Numero_Facture
        toPDF.Facture.Date_Creation = avoir.Facture.Date_Creation
        toPDF.Facture.Devis = JSON.parse(JSON.stringify(avoir.Facture.Devis))
        toPDF.Facture.Date_Evenement = avoir.Facture.Date_Evenement
        toPDF.Facture.Adresse_Livraison_Adresse = avoir.Facture.Adresse_Livraison_Adresse
        toPDF.Facture.Adresse_Livraison_Adresse_Complement_1 = avoir.Facture.Adresse_Livraison_Adresse_Complement_1
        toPDF.Facture.Adresse_Livraison_Adresse_Complement_2 = avoir.Facture.Adresse_Livraison_Adresse_Complement_2
        toPDF.Facture.Adresse_Livraison_CP = avoir.Facture.Adresse_Livraison_CP
        toPDF.Facture.Adresse_Livraison_Ville = avoir.Facture.Adresse_Livraison_Ville
        toPDF.Facture.Client = JSON.parse(JSON.stringify(avoir.Facture.Client))
        // la méthode {...} est utilisée pour si la formule est null avoir un objet et pouvoir définir isAperitif etc.
        toPDF.Facture.Formule_Aperitif = {...JSON.parse(JSON.stringify(avoir.Facture.Formule_Aperitif))} 
        toPDF.Facture.Formule_Aperitif.isAperitif = false
        toPDF.Facture.Formule_Cocktail = {...JSON.parse(JSON.stringify(avoir.Facture.Formule_Cocktail))}
        toPDF.Facture.Formule_Cocktail.isCocktail = false
        toPDF.Facture.Formule_Box = {...JSON.parse(JSON.stringify(avoir.Facture.Formule_Box))}
        toPDF.Facture.Formule_Box.isBox = false
        toPDF.Facture.Formule_Brunch = {...JSON.parse(JSON.stringify(avoir.Facture.Formule_Brunch))}
        toPDF.Facture.Formule_Brunch.isBrunch = false
        toPDF.Facture.Commentaire = avoir.Facture.Commentaire
        toPDF.Facture.Liste_Options = []
        toPDF.Facture.Remise = avoir.Facture.Remise
        toPDF.Facture.Acompte = avoir.Facture.Acompte
        toPDF.Facture.Reste_A_Payer = avoir.Facture.Reste_A_Payer
        toPDF.Facture.Prix_HT = avoir.Facture.Prix_HT
        toPDF.Facture.Prix_TTC = avoir.Facture.Prix_TTC

        if(avoir.Facture.Id_Formule_Aperitif !== null) toPDF.Facture.Formule_Aperitif.isAperitif = true
        if(avoir.Facture.Id_Formule_Cocktail !== null) toPDF.Facture.Formule_Cocktail.isCocktail = true
        if(avoir.Facture.Id_Formule_Box !== null) toPDF.Facture.Formule_Box.isBox = true
        if(avoir.Facture.Id_Formule_Brunch !== null) toPDF.Facture.Formule_Brunch.isBrunch = true

        // récupérer liste options avec nom et prix
        if(avoir.Facture.Liste_Options !== null && avoir.Facture.Liste_Options !== '') {
            const tabOptions = avoir.Facture.Liste_Options.split(';')
            for(let id of tabOptions) {
                if(id === '') continue
                const option = await Prix_Unitaire.findOne({
                    where : {
                        Id_Prix_Unitaire : id
                    }
                })
                if(option !== null) toPDF.Facture.Liste_Options.push({ Nom : option.Nom_Type_Prestation, Montant : option.Montant })
            }
        }

        createPDFAvoir(res, toPDF)
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
})

module.exports = {
    router,
    createAvoir
}
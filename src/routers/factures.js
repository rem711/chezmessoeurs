const express = require('express')
const router = new express.Router()
const { Factures, Devis, Clients } = global.db
const { Op } = require("sequelize")
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

const formatNumeroFacture = (num) => {
    const numSize = num.toString().length
    let formatedNumber = ''

    // on ajoute des 0 en dessous de 1000
    if(numSize < 4) {
        const diff = 4 - numSize
        for(let i = 0; i < diff; i++) {
            formatedNumber += '0'
        }
    }
    formatedNumber += num

    return formatedNumber
}

const createFacture = async (devis) => {
    let facture = undefined

    if(devis !== undefined && devis !== null && devis instanceof Devis) {
        const factureExistente = await Factures.findOne({
            where : {
                Id_Devis : devis.Id_Devis,
                Statut : {
                    [Op.notLike] : 'Annulée'
                }
            }
        })

        if(factureExistente !== null) {
            throw `La facture ${factureExistente.Numero_Facture} correspond déjà au devis n°${devis.Id_Devis}`
        }

        const today = moment.utc()
        facture = await Factures.create({
            Numero_Facture : today.format('YYYY-MM-'),
            Id_Client : devis.Id_Client,
            Date_Evenement : devis.Date_Evenement,
            Adresse_Livraison : devis.Adresse_Livraison,
            Id_Devis : devis.Id_Devis,
            Id_Formule_Aperitif : devis.Id_Formule_Aperitif,
            Id_Formule_Cocktail : devis.Id_Formule_Cocktail,
            Id_Formule_Box : devis.Id_Formule_Box,
            Id_Formule_Brunch : devis.Id_Formule_Brunch,
            Commentaire : devis.Commentaire,
            Liste_Options : devis.Liste_Options,
            Id_Remise : devis.Id_Remise,
            Prix_HT : devis.Prix_HT,
            Prix_TTC : devis.Prix_TTC,
            Reste_A_Payer : devis.Prix_TTC
        })

        if(facture !== null) {
            // màj Numero_Facture grâce à l'Id_Facture
            facture.Numero_Facture += formatNumeroFacture(facture.Id_Facture)
            facture.save()
        }
    }
    else {
        throw 'Une erreur est survenue lors de la création de la facture.'
    }

    return facture
}

router
// tableau factures
.get('/factures', async (req, res) => {
    // init les valeurs de retour
    let factures = undefined
    let infos = undefined

    try {
        // récupération des factures
        factures = await Factures.findAll({
            order : [
                ['Date_Creation', 'ASC']
            ],
            where : {
                Statut : {
                    [Op.notIn] : ['Archivée', 'Annulée'] 
                }
            },
            include : {
                all : true,
                nested : true
            }
        })

        // il y a un problème pour récupérer les factures
        if(factures === null) {
            infos = clientInformationObject('Une erreur s\'est produite, impossible de charger les factures.', undefined)        
        }
        // indique s'il n'y a pas de facture
        else if(factures.length === 0) {        
            infos = clientInformationObject(undefined, 'Aucune facture')
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.render('index', {
        isFactures : true,
        infos,
        factures,
        moment,
        formatDateHeure
    })
})
// facture spécifique
.get('/factures/:Id_Facture', async (req, res) => {
    let postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined
    let facture = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                },
                include : Clients
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos, 
        facture
    })
})
// modifie une facture
.patch('/factures/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    const body = req.body
    let infos = undefined
    let facture = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                }
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }

            if(!['En attente de paiement', 'Payée'].includes(body.Statut)) {
                throw "Le statut de la facture est incorrect."
            }

            facture.Statut = body.Statut

            body.Acompte = (body.Acompte === undefined || body.Acompte === 'undefined') ? 0 : Number(Number(body.Acompte).toFixed(2))
            if(body.Acompte < 0) {
                throw "La valeur de l'acompte ne peut pas être négative."
            }
            facture.Acompte = body.Acompte
            facture.Reste_A_Payer = Number(Number(facture.Prix_TTC - facture.Acompte).toFixed(2))

            if(facture.Reste_A_Payer === 0 && facture.Acompte === facture.Prix_TTC) {
                facture.Statut = 'Payée'
            }

            facture.save()
            infos = clientInformationObject(undefined, 'La facture a bien été modifiée.')
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        facture
    })
})
// archive une facture
.patch('/factures/archive/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined
    let facture = undefined

    try {
        if(!isNaN(postIdFacture && postIdFacture > 0)) {
            facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                }
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }
            
            if(facture.Statut === 'Annulée') {
                throw 'La facture ne peut pas être archivée.'
            }

            facture.Statut = 'Archivée'
            facture.save()

            infos = clientInformationObject(undefined, 'La facture a bien été archivée.')
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        facture
    })
})
// vérifie si le Numero_Facture est correct
.get('/factures/validate/:Id_Facture/:Numero_Facture', async (req, res) => {
    let postIdFacture = Number(req.params.Id_Facture)
    const postNumeroFacture = req.params.Numero_Facture
    let infos = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            const facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture,
                    Numero_Facture : postNumeroFacture
                }
            })

            if(facture === null) {
                throw "Le numéro de facture est incorrect."
            }

            infos = clientInformationObject(undefined, 'ok')
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos
    })
})
// TODO:export pdf
// voir plus tard pour renvoie email
.get(`/factures/pdf/${encodeURI('CHEZ MES SOEURS - Facture ')}:Numero_Facture.pdf`, async (req, res) => {
    // passe Statut à En attente de paiement
    // passe Client.Dernier_Statut à Facture envoyée
    res.send(req.params.Numero_Facture)
})
// envoie relance
.post('/factures/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined
    let facture = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                }
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }

            if(facture.Reste_A_Payer === 0) {
                throw 'La facture a déjà été réglée.'
            }

            // augmente le nombre de relances, ajoute la date de dernière relance
            facture.Nb_Relances = Number(facture.Nb_Relances) + 1
            facture.Date_Derniere_Relance = moment.utc()

            // FIXME:envoie la relance

            facture.save()
            infos = clientInformationObject(undefined, 'La relance a bien été envoyée.')
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        facture
    })
})
// TODO:annule une facture
// Une facture remise à un client ne peut pas être supprimée. Il faut procéder à un avoir qui va comptablement annuler la facture. Vous devrez impérativement remettre cet avoir au client en cas d’annulation de la facture.
// cf : https://www.clicfacture.com/numerotation-de-vos-factures/
.patch('/factures/cancel/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined
    let facture = undefined
    let urlAvoir = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                },
                include : Clients
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }

            const isCreateAvoir = facture.Statut === 'En attente de paiement'

            facture.Statut = 'Annulée'
            await facture.save()

            facture.Client.Dernier_Statut = 'Facture annulée'
            await facture.Client.save()

            // la facture a été transmise au client, il faut donc un avoir
            if(isCreateAvoir) {
                // FIXME:envoie avoir client
                // const avoir = await createAvoir()
                infos = clientInformationObject(undefined, `La facture ${facture.Numero_Facture} a été annulée. Un avoir a été créé.`)
                urlAvoir = 'url avoir à ouvrir dans une tab'
            }
            else {
                infos = clientInformationObject(undefined, `La facture ${facture.Numero_Facture} a été annulée.`)
            }    
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        facture,
        urlAvoir
    })
})
// suppression facture
.delete('/factures/:id', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined

    try {
        if(!isNaN(postIdFacture) && postIdFacture > 0) {
            const facture = await Factures.findOne({
                where : {
                    Id_Facture : postIdFacture
                }
            })

            if(facture === null) {
                throw "L'identifiant est incorrect ou la facture n'existe pas."
            }

            // supression du devis et des formules par contraintes d'intégrité
            facture.destroy()
        }
        else {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos
    })
})

module.exports = {
    router,
    formatNumeroFacture,
    createFacture
}
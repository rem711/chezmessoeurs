const express = require('express')
const router = new express.Router()
const { Ventes } = global.db
const { Op } = require("sequelize")
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const createPDFFacture = require('../utils/pdf/pdf_factures')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

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

        let Numero_Facture = `FA_${moment.utc().format('YYYYMMDD')}_****_${devis.Client.Nom.toUpperCase()}`

        facture = await Factures.create({
            Numero_Facture,
            Id_Client : devis.Id_Client,
            Date_Evenement : devis.Date_Evenement,
            Adresse_Livraison_Adresse : devis.Adresse_Livraison_Adresse,
            Adresse_Livraison_Adresse_Complement_1 : devis.Adresse_Livraison_Adresse_Complement_1,
            Adresse_Livraison_Adresse_Complement_2 : devis.Adresse_Livraison_Adresse_Complement_2,
            Adresse_Livraison_CP : devis.Adresse_Livraison_CP,
            Adresse_Livraison_Ville : devis.Adresse_Livraison_Ville,
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
            // màj Numero_Facture
            const numero = await compteurs.get(compteurs.COMPTEUR_FACTURES_AVOIRS)
            facture.Numero_Facture = facture.Numero_Facture.replace(/(\*){4}/g, formatNumeroFacture(numero))
            facture.save()
        }
    }
    else {
        throw 'Une erreur est survenue lors de la création de la facture.'
    }

    return facture
}

const getRetardPaiementStatus = (Date_Creation) => {
    const today = moment.utc()
    const creationDate = moment.utc(Date_Creation)
    const dueTo = creationDate.add(1, 'months').add(2, 'days')
    const diff = today.diff(dueTo, 'days')

    if(diff <= 0) {
        return 'Non'
    }
    
    return `+${diff}j`
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
            include : Clients
        })

        // il y a un problème pour récupérer les factures
        if(factures === null) {
            infos = clientInformationObject('Une erreur s\'est produite, impossible de charger les factures.', undefined)        
        }
        // indique s'il n'y a pas de facture
        else if(factures.length === 0) {        
            infos = clientInformationObject(undefined, 'Aucune facture')
        }

        const tabPromises = []
        for(const facture of factures) {
            const retard = getRetardPaiementStatus(facture.Date_Creation)
            if(retard !== facture.Paiement_En_Retard) {
                facture.Paiement_En_Retard = retard
                tabPromises.push(facture.save())
            }
        }
        await Promise.all(tabPromises)
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
            if(body.Statut === 'Payée') {
                facture.Reste_A_Payer = 0
            }

            if(facture.Statut !== 'Payée') {
                body.Acompte = (body.Acompte === undefined || body.Acompte === 'undefined') ? 0 : Number(Number(body.Acompte).toFixed(2))
                if(body.Acompte < 0) {
                    throw "La valeur de l'acompte ne peut pas être négatif."
                }
                facture.Acompte = body.Acompte
                facture.Reste_A_Payer = Number(Number(facture.Prix_TTC - facture.Acompte).toFixed(2))

                if(facture.Reste_A_Payer === 0 && facture.Acompte === facture.Prix_TTC) {
                    facture.Statut = 'Payée'
                }

                facture.Paiement_En_Retard = getRetardPaiementStatus(facture.Date_Creation)
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
// https://www.service-public.fr/professionnels-entreprises/vosdroits/F31808
// export pdf facture
.get(`/factures/pdf/${encodeURI('CHEZ MES SOEURS - Facture ')}:Numero_Facture.pdf`, async (req, res) => {
    const postNumeroFacture = req.params.Numero_Facture

    try {
        const facture = await Factures.findOne({
            where : {
                Numero_Facture : postNumeroFacture
            },
            include : {
                all : true,
                nested : true
            }
        })

        if(facture === null) {
            throw "La facture n'existe pas."
        }

        const toPDF = {}
        toPDF.Id_Facture = facture.Id_Facture
        toPDF.Numero_Facture = facture.Numero_Facture
        toPDF.Date_Creation = facture.Date_Creation
        toPDF.Devis = JSON.parse(JSON.stringify(facture.Devis))
        toPDF.Date_Evenement = facture.Date_Evenement
        toPDF.Adresse_Livraison_Adresse = facture.Adresse_Livraison_Adresse
        toPDF.Adresse_Livraison_Adresse_Complement_1 = facture.Adresse_Livraison_Adresse_Complement_1
        toPDF.Adresse_Livraison_Adresse_Complement_2 = facture.Adresse_Livraison_Adresse_Complement_2
        toPDF.Adresse_Livraison_CP = facture.Adresse_Livraison_CP
        toPDF.Adresse_Livraison_Ville = facture.Adresse_Livraison_Ville
        toPDF.Client = JSON.parse(JSON.stringify(facture.Client))
        // la méthode {...} est utilisée pour si la formule est null avoir un objet et pouvoir définir isAperitif etc.
        toPDF.Formule_Aperitif = {...JSON.parse(JSON.stringify(facture.Formule_Aperitif))} 
        toPDF.Formule_Aperitif.isAperitif = false
        toPDF.Formule_Cocktail = {...JSON.parse(JSON.stringify(facture.Formule_Cocktail))}
        toPDF.Formule_Cocktail.isCocktail = false
        toPDF.Formule_Box = {...JSON.parse(JSON.stringify(facture.Formule_Box))}
        toPDF.Formule_Box.isBox = false
        toPDF.Formule_Brunch = {...JSON.parse(JSON.stringify(facture.Formule_Brunch))}
        toPDF.Formule_Brunch.isBrunch = false
        toPDF.Commentaire = facture.Commentaire
        toPDF.Liste_Options = []
        toPDF.Remise = facture.Remise
        toPDF.Acompte = facture.Acompte
        toPDF.Reste_A_Payer = facture.Reste_A_Payer
        toPDF.Prix_HT = facture.Prix_HT
        toPDF.Prix_TTC = facture.Prix_TTC

        if(facture.Id_Formule_Aperitif !== null) toPDF.Formule_Aperitif.isAperitif = true
        if(facture.Id_Formule_Cocktail !== null) toPDF.Formule_Cocktail.isCocktail = true
        if(facture.Id_Formule_Box !== null) toPDF.Formule_Box.isBox = true
        if(facture.Id_Formule_Brunch !== null) toPDF.Formule_Brunch.isBrunch = true

        // récupérer liste options avec nom et prix
        if(facture.Liste_Options !== null && facture.Liste_Options !== '') {
            const tabOptions = facture.Liste_Options.split(';')
            for(let id of tabOptions) {
                if(id === '') continue
                const option = await Prix_Unitaire.findOne({
                    where : {
                        Id_Prix_Unitaire : id
                    }
                })
                if(option !== null) toPDF.Liste_Options.push({ Nom : option.Nom_Type_Prestation, Montant : option.Montant })
            }
        }

        createPDFFacture(res, toPDF)

        if(facture.Statut === 'En attente') {
            facture.Statut = 'En attente de paiement'
            facture.Client.Dernier_Statut = 'Facture envoyée'
            await facture.save()
            await facture.Client.save()
        }
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
})
// route tampon pour la création d'un acompte. Récupère les valeurs nécessaires et les passe à la route de génération du pdf (avec l'url formatée)
.get('/factures/acomptes/generate/:Id_Facture/:Value/:IsPourcent',  async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    const value = Number(req.params.Value)
    const isPourcent = Number(req.params.IsPourcent)
    let Numero_Acompte = undefined

    try {
        if(isNaN(postIdFacture) || postIdFacture < 1) {
            throw "L'identifiant de la facture est incorrect."
        }
        if(isNaN(value) || value === 0) {
            throw "La valeur de l'acompte est incorrecte."
        }
        if(isPourcent !== 0 && isPourcent !== 1) {
            throw "La valeur du pourcentage est incorrecte."
        }
        if(isPourcent && value > 100) {
            throw "Le pourcentage ne peut pas excéder 100%."
        }

        const facture = await Factures.findOne({
            where : {
                Id_Facture : postIdFacture
            },
            include : {
                all : true,
                nested : true
            }
        })

        if(facture === null) {
            throw "L'identifiant est incorrect ou la facture n'existe pas."
        }
        if(facture.Statut === 'Archivée' || facture.Statut === 'Annulée') {
            throw "Cette facture n'es plus accessible."
        }

        if(!isPourcent && value > facture.Reste_A_Payer) {
            throw "Le montant est supérieur à la somme restant à payer."
        }

        // les vérification sont bonnes
        const numero = await compteurs.get(compteurs.COMPTEUR_ACOMPTES)
        Numero_Acompte = `FAA_${moment.utc().format('YYYYMMDD')}_${formatNumeroFacture(numero)}_${facture.Client.Nom.toUpperCase()}`

        // mise des valeurs nécessaires en session
        req.session.Facture = facture
        req.session.AcompteValue = Number(Number(value).toFixed(2))
        req.session.IsPourcent = isPourcent
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)

        return res.send(infos.error)
    }    

    return res.redirect(`/factures/acomptes/pdf/${encodeURI('CHEZ MES SOEURS - Facture d\'Acompte ')}${Numero_Acompte}.pdf`)
})
// export pdf facture d'acompte
.get(`/factures/acomptes/pdf/${encodeURI('CHEZ MES SOEURS - Facture d\'Acompte ')}:Numero_Acompte.pdf`, async (req, res) => {
    const Numero_Acompte = req.params.Numero_Acompte
    const facture = req.session.Facture
    const value = req.session.AcompteValue
    const isPourcent = req.session.IsPourcent

    req.session.Facture = undefined
    req.session.AcompteValue = undefined
    req.session.IsPourcent = undefined

    try {
        if(!isSet(Numero_Acompte) || !isSet(facture) || !isSet(value) || !isSet(isPourcent)) {
            throw "Vous n'avez pas accès à cette ressource."
        }

        const acompte = {
            Numero_Acompte,
            Facture : facture,
            Valeur : value,
            IsPourcent : isPourcent,
            Montant : isPourcent ? Number(Number((value / 100) * facture.Reste_A_Payer).toFixed(2)) : value
        }

        createPDFAcompte(res, acompte)
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
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
            if(facture.Statut === 'En attente') {
                throw "Cette facture n'as pas encore été envoyée."
            }

            // augmente le nombre de relances, ajoute la date de dernière relance
            facture.Nb_Relances = Number(facture.Nb_Relances) + 1
            facture.Date_Derniere_Relance = moment.utc()
            facture.Paiement_En_Retard = getRetardPaiementStatus(facture.Date_Creation)

            facture.save()
            infos = clientInformationObject(undefined, 'La relance est disponible dans une nouvelle fenêtre.')
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
.get('/factures/:Id_Facture/relance', async (req, res) => {
    const postIdFacture = req.params.Id_Facture
    let facture = undefined

    try {
        facture = await Factures.findOne({
            where : {
                Id_Facture : postIdFacture
            }
        })

        if(facture === null) {
            throw "La facture n'existe pas."
        }
        if(facture.Statut === 'Archivée' || facture.Statut === 'Annulée') {
            throw "Cette facture n'es plus accessible."
        }
        if(facture.Statut === 'En attente') {
            throw "Cette facture n'as pas encore été envoyée."
        }

    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)

        return res.send(infos.error)
    }

    return res.redirect(`/factures/relance/pdf/${encodeURI('CHEZ MES SOEURS - Relance Facture ')}${facture.Numero_Facture}.pdf`)
})
// réécriture de l'url pour générer le pdf de relance de facture
.get(`/factures/relance/pdf/${encodeURI('CHEZ MES SOEURS - Relance Facture ')}:Numero_Facture.pdf`, async (req, res) => {
    const postNumeroFacture = req.params.Numero_Facture

    try {
        const facture = await Factures.findOne({
            where : {
                Numero_Facture : postNumeroFacture
            },
            include : {
                all : true,
                nested : true
            }
        })

        if(facture === null) {
            throw "La facture n'existe pas."
        }

        const toPDF = {}
        toPDF.Id_Facture = facture.Id_Facture
        toPDF.Numero_Facture = facture.Numero_Facture
        toPDF.Date_Creation = facture.Date_Creation
        toPDF.Devis = JSON.parse(JSON.stringify(facture.Devis))
        toPDF.Date_Evenement = facture.Date_Evenement
        toPDF.Adresse_Livraison_Adresse = facture.Adresse_Livraison_Adresse
        toPDF.Adresse_Livraison_Adresse_Complement_1 = facture.Adresse_Livraison_Adresse_Complement_1
        toPDF.Adresse_Livraison_Adresse_Complement_2 = facture.Adresse_Livraison_Adresse_Complement_2
        toPDF.Adresse_Livraison_CP = facture.Adresse_Livraison_CP
        toPDF.Adresse_Livraison_Ville = facture.Adresse_Livraison_Ville
        toPDF.Client = JSON.parse(JSON.stringify(facture.Client))
        // la méthode {...} est utilisée pour si la formule est null avoir un objet et pouvoir définir isAperitif etc.
        toPDF.Formule_Aperitif = {...JSON.parse(JSON.stringify(facture.Formule_Aperitif))} 
        toPDF.Formule_Aperitif.isAperitif = false
        toPDF.Formule_Cocktail = {...JSON.parse(JSON.stringify(facture.Formule_Cocktail))}
        toPDF.Formule_Cocktail.isCocktail = false
        toPDF.Formule_Box = {...JSON.parse(JSON.stringify(facture.Formule_Box))}
        toPDF.Formule_Box.isBox = false
        toPDF.Formule_Brunch = {...JSON.parse(JSON.stringify(facture.Formule_Brunch))}
        toPDF.Formule_Brunch.isBrunch = false
        toPDF.Commentaire = facture.Commentaire
        toPDF.Liste_Options = []
        toPDF.Remise = facture.Remise
        toPDF.Acompte = facture.Acompte
        toPDF.Reste_A_Payer = facture.Reste_A_Payer
        toPDF.Nb_Relances = facture.Nb_Relances
        toPDF.Prix_HT = facture.Prix_HT
        toPDF.Prix_TTC = facture.Prix_TTC

        if(facture.Id_Formule_Aperitif !== null) toPDF.Formule_Aperitif.isAperitif = true
        if(facture.Id_Formule_Cocktail !== null) toPDF.Formule_Cocktail.isCocktail = true
        if(facture.Id_Formule_Box !== null) toPDF.Formule_Box.isBox = true
        if(facture.Id_Formule_Brunch !== null) toPDF.Formule_Brunch.isBrunch = true

        // récupérer liste options avec nom et prix
        if(facture.Liste_Options !== null && facture.Liste_Options !== '') {
            const tabOptions = facture.Liste_Options.split(';')
            for(let id of tabOptions) {
                if(id === '') continue
                const option = await Prix_Unitaire.findOne({
                    where : {
                        Id_Prix_Unitaire : id
                    }
                })
                if(option !== null) toPDF.Liste_Options.push({ Nom : option.Nom_Type_Prestation, Montant : option.Montant })
            }
        }

        createPDFFacture(res, toPDF, true)

        facture.Client.Dernier_Statut = 'Relance envoyée'
        await facture.Client.save()
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
})
// Une facture remise à un client ne peut pas être supprimée. Il faut procéder à un avoir qui va comptablement annuler la facture. Vous devrez impérativement remettre cet avoir au client en cas d’annulation de la facture.
// cf : https://www.clicfacture.com/numerotation-de-vos-factures/
.patch('/factures/cancel/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
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

            const avoir = await createAvoir(facture)

            facture.Statut = 'Annulée'
            await facture.save()

            facture.Client.Dernier_Statut = 'Facture annulée'
            await facture.Client.save()

            infos = clientInformationObject(undefined, `La facture ${facture.Numero_Facture} a été annulée. Un avoir a été créé.`) 
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

module.exports = {
    router,
    createFacture
}
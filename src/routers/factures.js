const express = require('express')
const router = new express.Router()
const { Factures, Clients, Ventes } = global.db
const { Op } = require("sequelize")
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const createPDFFacture = require('../utils/pdf/pdf_factures')
const createPDFAcompte = require('../utils/pdf/pdf_acomptes')
const createPDFAvoir = require('../utils/pdf/pdf_avoirs')
const moment = require('moment')
const frontFormatDate = 'DD/MM/YYYY'
const serverFormatDate = 'YYYY-MM-DD'
const ACOMPTE = 'acompte'
const SOLDE = 'solde'
const TVA = 10

const getRetardPaiementStatus = (Date_Creation, Date_Paiement_Du) => {
    const today = moment()
    const creationDate = moment(Date_Creation)
    const dueTo = moment(Date_Paiement_Du)
    const diff = today.diff(dueTo, 'days')

    if(diff <= 0) {
        return 'En attente'
    }
    
    return `En retard de ${diff}j`
}

const checkFacture = async (factureSent) => {
    if(!isSet(factureSent.Ref_Facture)) throw "Le numéro de référence de la facture doit être indiqué."
    if(!isSet(factureSent.Type_Facture)) throw "Le type de facture doit être sélectionné."
    if(![ACOMPTE, SOLDE].includes(factureSent.Type_Facture)) throw "Le type de facture est incorrect."
    if(!isSet(factureSent.Id_Vente)) throw "La vente rattachée à la facture doit être sélectionnée."

    const vente = await Ventes.findOne({
        where : {
            Id_Vente : factureSent.Id_Vente
        }
    })

    if(vente === null) throw "La vente sélectionnée est introuvable."
    if(!isSet(factureSent.Description)) throw "Le contenu descriptif de la facture doit être renseigné."
    if(factureSent.Type_Facture === ACOMPTE && !isSet(factureSent.Pourcentage_Acompte)) throw "Le pourcentage d'acompte doit être indiqué."
    if(factureSent.Type_Facture === SOLDE && !isSet(factureSent.Prix_TTC)) throw "Le montant du solde doit être indiqué."    
    if(factureSent.Type_Facture === SOLDE && factureSent.Prix_TTC > vente.Reste_A_Payer) throw "Le montant de la facture ne peut pas exéder le montant restant à payer sur cette vente."
    if(!isSet(factureSent.Date_Paiement_Du)) throw "La date de paiement doit être indiquée."
    if(!factureSent.Date_Paiement_Du.match(/^(?:(?:0[1-9])|(?:1[0-9])|(?:2[0-9])|(?:3[0-1]))\/(?:(?:0[1-9])|(?:1[0-2]))\/20\d{2}$/)) throw "Le format de la date est incorrect."

    return vente
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
            include : {
                all : true,
                nested : true
            },
            order : [['Created_At', 'ASC']]
        })

        // il y a un problème pour récupérer les factures
        if(factures === null) {
            infos = clientInformationObject('Une erreur s\'est produite, impossible de charger les factures.', undefined)        
        }
        // indique s'il n'y a pas de facture
        else if(factures.length === 0) {        
            infos = clientInformationObject(undefined, 'Aucune facture')
        }

        // const tabPromises = []
        // for(const facture of factures) {
        //     const retard = getRetardPaiementStatus(facture.Date_Creation)
            // if(retard !== facture.Paiement_En_Retard) {
            //     facture.Paiement_En_Retard = retard
            //     tabPromises.push(facture.save())
            // }
        // }
        // await Promise.all(tabPromises)
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.render('index', {
        isFactures : true,
        infos,
        factures,
        moment,
        frontFormatDate,
        getRetardPaiementStatus
    })
})
// facture spécifique
.get('/factures/:Id_Facture', async (req, res) => {
    let postIdFacture = Number(req.params.Id_Facture)
    let infos = undefined
    let facture = undefined

    try {      
        if(isNaN(postIdFacture)) throw "L'identifiant est incorrect."

        facture = await Factures.findOne({
            include : {
                all : true,
                nested : true
            },
            where : {
                Id_Facture : postIdFacture
            }
        })
        
        if(facture === null) throw "Aucune facture correspondante."
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
// crée une facture
.post('/factures', async (req, res) => {
    const factureSent = req.body

    let infos = undefined
    let facture = undefined

    try {
        const vente = await checkFacture(factureSent)

        let prix = 0
        if(factureSent.Type_Facture === ACOMPTE) {
            prix = Number(vente.Reste_A_Payer * (Number(factureSent.Pourcentage_Acompte) / 100)).toFixed(2)
        }
        else {
            prix = Number(factureSent.Prix_TTC).toFixed(2)
        }
        factureSent.Prix_TTC = undefined

        factureSent.Date_Paiement_Du = moment(factureSent.Date_Paiement_Du, frontFormatDate).format(serverFormatDate)

        facture = await Factures.create({
            ...factureSent,
            Prix_TTC : prix
        })

        if(facture === null) throw "Une erreur est survenue lors de la création de la facture, veuillez réessayer plus tard."

        vente.Reste_A_Payer = vente.Reste_A_Payer - facture.Prix_TTC
        await vente.save()

        // recharge la facture avec les éléments associés
        facture = await Factures.findOne({
            include : {
                all : true,
                nested : true
            },
            where : {
                Id_Facture : facture.Id_Facture
            }
        })

        if(facture === null) throw "Une erreur est survenue lors du chargement de la facture, veuillez réessayer plus tard."

        infos = clientInformationObject(undefined, "La facture a bien été créée.")
    }
    catch(error) {  
        facture = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        facture
    })
})
// modifie une facture
.patch('/factures/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)
    const factureSent = req.body

    let infos = undefined
    let facture = undefined

    try {
        if(isNaN(postIdFacture)) throw "L'identifiant est incorrect."
        
        facture = await Factures.findOne({
            where : {
                Id_Facture : postIdFacture
            }
        })

        if(facture === null) {
            throw "Aucune facture correspondante."
        }

        if(facture.IsPayed) throw "Vous ne pouvez pas modifier une facture déjà payée."
        if(facture.IsCanceled) throw "Vous ne pouvez pas modifier une facture qui est annulée."

        const vente = await checkFacture(factureSent)       
        
        // factureSent.Id_Vente = Number(factureSent.Id_Vente)
        // if(factureSent.Pourcentage_Acompte !== null) factureSent.Pourcentage_Acompte = Number(factureSent.Pourcentage_Acompte)
        // factureSent.Prix_TTC = Number(factureSent.Prix_TTC)
        factureSent.Date_Paiement_Du = moment(factureSent.Date_Paiement_Du, frontFormatDate).format(serverFormatDate)

        // let prix = facture.Prix_TTC
        // if(factureSent.Type_Facture !== facture.Type_Facture || factureSent.Pourcentage_Acompte !== facture.Pourcentage_Acompte || factureSent.Prix_TTC !== facture.Prix_TTC || facture.Id_Vente !== factureSent.Id_Vente) {
        //     // si la facture est toujours pour la même vente
        //     if(facture.Id_Vente === factureSent.Id_Vente) {
        //         // on recrédite la vente
        //         console.log(`vente départ : ${vente.Reste_A_Payer}`)
        //         vente.Reste_A_Payer = vente.Reste_A_Payer + facture.Prix_TTC
        //         console.log(`vente recréditée : ${vente.Reste_A_Payer}`)
        //     }
        //     else {
        //         // on recrédite la vente précédente
        //         const previousVente = await Ventes.findOne({
        //             where : {
        //                 Id_Vente : facture.Id_Vente
        //             }
        //         })

        //         if(previousVente !== null) {
        //             console.log(`previous vente rap : ${previousVente.Reste_A_Payer}`)
        //             previousVente.Reste_A_Payer = previousVente.Reste_A_Payer + facture.Prix_TTC
        //             console.log(`previous vente rap recrédité : ${previousVente.Reste_A_Payer}`)
        //             previousVente.save()
        //         }
        //     }            
            
        //     // calcul du nouveau prix        
        //     if(factureSent.Type_Facture === ACOMPTE) {
        //         prix = Number(vente.Reste_A_Payer * (Number(factureSent.Pourcentage_Acompte) / 100)).toFixed(2)
        //     }
        //     else {
        //         prix = Number(factureSent.Prix_TTC).toFixed(2)
        //     }

        //     vente.Reste_A_Payer = vente.Reste_A_Payer - prix
        //     console.log(`vente recalculée : ${vente.Reste_A_Payer}`)
        // }
        // factureSent.Prix_TTC = undefined

        // affectation des nouvelles valeurs
        facture.Ref_Facture = factureSent.Ref_Facture
        // facture.Type_Facture = factureSent.Type_Facture
        // facture.Id_Vente = factureSent.Id_Vente
        facture.Description = factureSent.Description
        // facture.Pourcentage_Acompte = factureSent.Pourcentage_Acompte
        // facture.Prix_TTC = prix
        facture.Date_Paiement_Du = factureSent.Date_Paiement_Du

        await Promise.all([
            facture.save(),
            vente.save()
        ])

        // recharge la facture avec les éléments associés
        facture = await Factures.findOne({
            include : {
                all : true,
                nested : true
            },
            where : {
                Id_Facture : facture.Id_Facture
            }
        })

        if(facture === null) throw "Une erreur est survenue lors du chargement de la facture, veuillez réessayer plus tard."
        
        infos = clientInformationObject(undefined, 'La facture a bien été modifiée.')        
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
// passe une facture en payée
.patch('/factures/isPayed/:Id_Facture', async (req, res) => {
    const postIdFacture = Number(req.params.Id_Facture)

    let infos = undefined
    let facture = undefined

    try {
        if(isNaN(postIdFacture)) throw "L'identifiant est incorrect."
        
        facture = await Factures.findOne({
            where : {
                Id_Facture : postIdFacture
            }
        })

        if(facture === null) {
            throw "Aucune facture correspondante."
        }

        if(facture.IsCanceled) throw "La facture est annulée et ne peut donc pas être marquée comme payée."
        if(facture.IsPayed) throw "La facture est déjà payée."

        facture.IsPayed = true
        await facture.save()

        clientInformationObject(undefined, "La facture a bien été marquée comme payée.")
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
// annulation facture
// Une facture remise à un client ne peut pas être supprimée. Il faut procéder à un avoir qui va comptablement annuler la facture. Vous devrez impérativement remettre cet avoir au client en cas d’annulation de la facture.
// cf : https://www.clicfacture.com/numerotation-de-vos-factures/
.patch('/factures/cancel/:Id_Facture', async (req, res) => {
    const Id_Facture = Number(req.params.Id_Facture)

    let infos = undefined
    let facture = undefined

    try {
        if(isNaN(Id_Facture)) throw "L'identifiant est incorrect."

        facture = await Factures.findOne({
            include : {
                all : true,
                nested : true
            },
            where : {
                Id_Facture
            }
        })

        if(facture === null) throw "Aucune facture correspondante."

        if(!facture.IsCanceled) facture.Vente.Reste_A_Payer += facture.Prix_TTC
        facture.IsCanceled = true

        await Promise.all([
            facture.Vente.save(),
            facture.save()
        ])

        infos = clientInformationObject(undefined, `La facture ${facture.Ref_Facture} a bien été annulée. Un avoir a été créé.`)
    }
    catch(error) {
        facture = undefined
        infos = clientInformationObject(error)
    }

    res.send({
        infos, 
        facture
    })
})
// https://www.service-public.fr/professionnels-entreprises/vosdroits/F31808
// export pdf facture et facture d'acompte
.get(`/factures/pdf/${encodeURI('CHEZ MES SOEURS - Facture ')}:Ref_Facture.pdf`, async (req, res) => {
    const postRefFacture = req.params.Ref_Facture

    try {
        const facture = await Factures.findOne({
            where : {
                Ref_Facture : postRefFacture
            },
            include : {
                all : true,
                nested : true
            }
        })

        if(facture === null) {
            throw "La facture n'existe pas."
        }

        // récupération des différentes factures pour cette vente créées avant cette facture
        const previousFactures = await Factures.findAll({
            where : {
                Id_Vente : facture.Id_Vente,
                Created_At : {
                    [Op.lt] : facture.Created_At
                }
            }
        })

        const lastFacture = await Factures.findOne({
            where : {
                Id_Vente : facture.Id_Vente
            },
            order : [['Created_At', 'DESC']]
        })

        let acompteVerse = 0
        if(previousFactures !== null && previousFactures.length > 0) {
            // somme des factures précédentes pour connaître le montant de l'acompte déjà versé
            acompteVerse = previousFactures.reduce((accumulator, currentValue) => accumulator + currentValue.Prix_TTC, 0)
        }

        const toPDF = {}
        toPDF.Id_Facture = facture.Id_Facture
        toPDF.Ref_Facture = facture.Ref_Facture
        toPDF.Client = JSON.parse(JSON.stringify(facture.Vente.Client))
        toPDF.Vente = JSON.parse(JSON.stringify(facture.Vente))
        toPDF.Date_Evenement = moment(facture.Vente.Date_Evenement).format('DD/MM/YYYY')
        toPDF.Date_Paiement_Du = facture.Date_Paiement_Du 
        toPDF.Description = facture.Description    

        if(facture.Type_Facture === ACOMPTE) {
            toPDF.Pourcentage_Acompte = Number(facture.Pourcentage_Acompte).toFixed(2)
        }

        toPDF.Reste_A_Payer = Number(facture.Vente.Reste_A_Payer).toFixed(2)
        toPDF.Prix_HT = Number(facture.Prix_TTC - (facture.Prix_TTC * (TVA / 100))).toFixed(2)
        toPDF.Prix_TTC = Number(facture.Prix_TTC).toFixed(2)
        toPDF.acompteVerse = Number(acompteVerse).toFixed(2)
        toPDF.Date_Paiement_Du = moment(facture.Date_Paiement_Du).format('DD/MM/YYYY')

        // on regarde si c'est une facture d'acompte ou la facture du solde de la vente
        // facture
        // soit le montant de la facture correspondant au prix total de la vente
        // soit le montant de la facture et des acomptes versés précédemment correspondent au prix total de la facture
        // soit le reste à payer de la vente est nul et la facture correspond à la dernière émise pour le solde
        if(facture.Prix_TTC === facture.Vente.Prix_TTC || (acompteVerse + facture.Prix_TTC) === facture.Vente.Prix_TTC || (facture.Vente.Reste_A_Payer === 0 && lastFacture.Id_Facture === facture.Id_Facture)) {
            createPDFFacture(res, toPDF)
        }
        // acompte
        else {
            createPDFAcompte(res, toPDF)
        }
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
})
// pdf facture d'avoir en cas d'annulation
.get(`/factures/pdf/:Id_Facture/${encodeURI('CHEZ MES SOEURS - Facture d\'Avoir ')}:Ref_Avoir.pdf`, async (req, res) => {
    const Id_Facture = Number(req.params.Id_Facture)
    const Ref_Avoir = req.params.Ref_Avoir

    try {
        if(isNaN(Id_Facture)) throw "L'identifiant est incorrect."

        const facture = await Factures.findOne({
            include : {
                all : true,
                nested : true
            },
            where : {
                Id_Facture
            }
        })

        if(facture === null) throw "Aucune facture correspondante."

        const toPDF = {}
        toPDF.Id_Facture = facture.Id_Facture
        toPDF.Ref_Facture = facture.Ref_Facture
        toPDF.Ref_Avoir = Ref_Avoir
        toPDF.Client = JSON.parse(JSON.stringify(facture.Vente.Client))
        toPDF.Vente = JSON.parse(JSON.stringify(facture.Vente))
        toPDF.Description = facture.Description    

        if(facture.Type_Facture === ACOMPTE) {
            toPDF.Pourcentage_Acompte = Number(facture.Pourcentage_Acompte).toFixed(2)
        }
        
        toPDF.Prix_HT = Number(facture.Prix_TTC - (facture.Prix_TTC * (TVA / 100))).toFixed(2)
        toPDF.Prix_TTC = Number(facture.Prix_TTC).toFixed(2)

        createPDFAvoir(res, toPDF)
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
            facture.Date_Derniere_Relance = moment()
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

    return res.redirect(`/factures/relance/pdf/${encodeURI('CHEZ MES SOEURS - Relance Facture ')}${facture.Ref_Facture}.pdf`)
})
// réécriture de l'url pour générer le pdf de relance de facture
.get(`/factures/relance/pdf/${encodeURI('CHEZ MES SOEURS - Relance Facture ')}:Ref_Facture.pdf`, async (req, res) => {
    const postNumeroFacture = req.params.Ref_Facture

    try {
        const facture = await Factures.findOne({
            where : {
                Ref_Facture : postNumeroFacture
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
        toPDF.Ref_Facture = facture.Ref_Facture
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

module.exports = {
    router,
    getRetardPaiementStatus
}
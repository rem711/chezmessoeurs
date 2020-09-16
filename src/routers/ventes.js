const express = require('express')
const router = new express.Router()
const { Ventes, Clients, Factures } = global.db
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const moment = require('moment')

// vérifie que les infos d'une vente sont correctes
async function checkVente(vente) {
    if(!vente) throw "Aucune vente fournie."
    if(!isSet(vente.Id_Client)) throw "Un client doit être sélectionné."

    const client = await Clients.findOne({
        where : {
            Id_Client : vente.Id_Client
        }
    })

    if(!isSet(client)) throw "Le client sélectionné est introuvable."
    if(!isSet(vente.Description)) throw "La description doit être remplie."
    if(!isSet(vente.Date_Evenement)) throw "La date de l'événement doit être sélectionnée."
    if(!vente.Date_Evenement.match(/^(?:(?:0[1-9])|(?:1[0-9])|(?:2[0-9])|(?:3[0-1]))\/(?:(?:0[1-9])|(?:1[0-2]))\/20\d{2} (?:(?:(0|1)[0-9])|(?:2[0-3])):(?:(?:0|1|2|3|4|5)[0-9])$/)) throw "Le format de la date est incorrect."
    if(!isSet(vente.Prix_TTC)) throw "Le prix doit être renseigné."
    if(!(vente.Prix_TTC > 0)) throw "Le prix doit être positif."
    if(!isSet(vente.Nb_Personnes)) throw "Le nombre de convives doit être renseigné."
    if(vente.Nb_Personnes < 6) throw "Le nombre de convives est de minimum 6."
    if(!isSet(vente.Ref_Devis)) throw "La référence du devis doit être renseignée."
}

router
// affiche la page des ventes
.get('/ventes', async (req, res) => {
    let infos = undefined
    let ventes = undefined

    try {
        ventes = await Ventes.findAll({
            include : Clients,
            order : [['Date_Evenement', 'ASC']]
        })

        if(ventes === null) {
            throw "une erreur s'est produite, impossible de charger les ventes."
        }
        if(ventes.length === 0) {
            infos = clientInformationObject(undefined, "Aucune vente.")
        }
    }
    catch(error) {
        ventes = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.render('index', {
        isVentes : true,
        infos,
        ventes,
        moment
    })
})
// récupère une vente
.get('/ventes/:Id_Vente', async (req, res) => {
    const Id_Vente = Number(req.params.Id_Vente)

    let infos = undefined
    let vente = undefined

    try {
        if(isNaN(Id_Vente)) throw "L'identifiant de la vente est incorrect."

        vente = await Ventes.findOne({
            where : {
                Id_Vente
            }
        })

        if(!vente) throw "Aucune vente correspondante."
    }
    catch(error) {
        vente = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        vente
    })
})
// crée une nouvelle vente
.post('/ventes', async (req, res) => {
    const venteSent = req.body

    let infos = undefined
    let vente = undefined

    try {
        await checkVente(venteSent)

        venteSent.Date_Evenement = moment(venteSent.Date_Evenement, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD  HH:mm')

        vente = await Ventes.create({
            ...venteSent,
            Reste_A_Payer : venteSent.Prix_TTC
        })

        if(!vente) throw "Une erreur est survenue lors de la création de la vente, veuillez recommencer."

        infos = clientInformationObject(undefined, "La vente a bien été ajoutée.")
    }
    catch(error) {
        vente = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        vente
    })
})
// modifie une vente existente
.patch('/ventes/:Id_Vente', async (req, res) => {
    const Id_Vente = Number(req.params.Id_Vente)
    const venteSent = req.body

    let infos = undefined
    let vente = undefined

    try {
        if(isNaN(Id_Vente)) throw "L'identifiant de la vente est incorrect."

        vente = await Ventes.findOne({
            where : {
                Id_Vente
            }
        })

        if(!vente) throw "Aucune vente correspondante."

        await checkVente(venteSent)

        venteSent.Date_Evenement = moment(venteSent.Date_Evenement, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm')

        // dans le cas où le prix a été modifié, on vérifie s'il y a des factures et pour quel montant afin de recalculer le Reste_A_Payer
        if(vente.Prix_TTC !== venteSent.Prix_TTC) {
            const listeFactures = await Factures.findAll({
                attributes : ['Prix_TTC'],
                where : {
                    Id_Vente
                }
            })

            // s'il y a des factures on recalcule le reste à payer
            if(listeFactures !== null && listeFactures.length > 0) {
                let total = listeFactures.reduce((accumulator, facture) => accumulator + facture.Prix_TTC, 0)

                if(total > venteSent.Prix_TTC) throw "Le nouveau prix est inférieur à la somme déjà facturée."

                venteSent.Reste_A_Payer = venteSent.Prix_TTC - total
            }
            else {
                venteSent.Reste_A_Payer = venteSent.Prix_TTC
            }
        }
        else {
            venteSent.Reste_A_Payer = vente.Reste_A_Payer
        }

        vente.Id_Client = venteSent.Id_Client
        vente.Description = venteSent.Description
        vente.Date_Evenement = venteSent.Date_Evenement
        vente.Prix_TTC = venteSent.Prix_TTC
        vente.Nb_Personnes = venteSent.Nb_Personnes
        vente.Ref_Devis = venteSent.Ref_Devis
        vente.Reste_A_Payer = venteSent.Reste_A_Payer

        await vente.save()

        infos = clientInformationObject(undefined, "La vente a bien été modifée.")
    }
    catch(error) {
        vente = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        vente
    })
})
// supprime une vente existente
.delete('/ventes/:Id_Vente', async (req, res) => {
    const Id_Vente = Number(req.params.Id_Vente)

    let infos = undefined

    try {
        if(isNaN(Id_Vente)) throw "L'identifiant de la vente est incorrect."

        vente = await Ventes.findOne({
            where : {
                Id_Vente
            }
        })

        if(!vente) throw "Aucune vente correspondante."

        const listeFactures = await Factures.findAll({
            where : {
                Id_Vente : vente.Id_Vente
            }
        })

        if(listeFactures && listeFactures.length > 0) throw "La vente ne peut pas être supprimée car une ou des factures ont déjà été émises."

        await vente.destroy()

        infos = clientInformationObject(undefined, "La vente a bien été supprimée.")
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos
    })
})

module.exports = router
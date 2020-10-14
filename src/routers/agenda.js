const express = require('express')
const router = new express.Router()
const { Ventes, Clients } = global.db
const { Op } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const moment = require('moment')

// format event
// {
//     "title": "Event 1",
//     "start": "2019-09-05T09:00:00",
//     "end": "2019-09-05T18:00:00"
// },
// https://fullcalendar.io/docs/event-object
const formatter = (liste) => {
    const formattedListe = []

    if(liste.length > 0) {
        for(const elt of liste) {
            const { Date_Evenement, Nb_Personnes, Client } = elt

            let title = `${Client.Prenom} ${Client.Nom}`
            if(Client.Societe) title += ` (${Client.Societe})`
            title += ` - ${Nb_Personnes} convives`

            // let url = ''

            const event = {
                title,
                start : Date_Evenement,
                allDay : false,
                // url,
                editable : false
            }
            formattedListe.push(event)
        }
    }

    return formattedListe
}

router
// agenda
.get('/agenda', (req, res) => {
    res.render('index', {
        isAgenda : true
    })
})
.get('/agenda/ventes', async (req, res) => {
    let start = moment(req.query.start)
    let end = moment(req.query.end)

    let returnedValue = undefined

    try {
        if(!(start.isValid() && end.isValid())) {
            throw "La date de début ou de fin est incorrecte."
        }

        const ventes = await Ventes.findAll({
            include : Clients,
            where : {
                Date_Evenement : {
                    [Op.between] : [start, end]
                }
            }
        })

        if(ventes === null) throw "Une erreur est survenue."

        returnedValue = formatter(ventes)
    }
    catch(error) {
        returnedValue = clientInformationObject(getErrorMessage(error), undefined)
        res.status(409)
    }

    res.send(returnedValue)
})
// renvoie une liste json au format event de fullcalendar des estimations comprises entre start et end (start <= envents < end)
// .get('/agenda/estimations', async (req, res) => {
//     let start = moment(req.query.start)
//     let end = moment(req.query.end)

//     let returnedValue = undefined

//     try {
//         if(!(start.isValid() && end.isValid())) {
//             throw "La date de début ou de fin est incorrecte."
//         }

//         const estimations = await Estimations.findAll({
//             where : {
//                 Statut : {
//                     [Op.notLike] : 'Archivée'
//                 },
//                 Date_Evenement : {
//                     [Op.between] : [start, end]
//                 }
//             },
//             include : {
//                 all : true,
//                 nested : true
//             }
//         })

//         if(estimations === null) {
//             throw "Une erreur est survenue."
//         }
        
//         returnedValue = formatter(estimations)
//     }
//     catch(error) {
//         returnedValue = clientInformationObject(getErrorMessage(error), undefined)
//         res.status(409)
//     }

//     res.send(returnedValue)
// })
// renvoie une liste json au format event de fullcalendar des devis compris entre start et end (start <= envents < end)
// .get('/agenda/devis', async (req, res) => {
//     let start = moment(req.query.start)
//     let end = moment(req.query.end)

//     let returnedValue = undefined

//     try {
//         if(!(start.isValid() && end.isValid())) {
//             throw "La date de début ou de fin est incorrecte."
//         }

//         const devis = await Devis.findAll({
//             where : {
//                 Statut : {
//                     [Op.notLike] : 'Archivée'
//                 },
//                 Date_Evenement : {
//                     [Op.between] : [start, end]
//                 }
//             },
//             include : {
//                 all : true,
//                 nested : true
//             }
//         })

//         if(devis === null) {
//             throw "Une erreur est survenue."
//         }
        
//         returnedValue = formatter(devis)
//     }
//     catch(error) {
//         returnedValue = clientInformationObject(getErrorMessage(error), undefined)
//         res.status(409)
//     }

//     res.send(returnedValue)
// })

module.exports = router
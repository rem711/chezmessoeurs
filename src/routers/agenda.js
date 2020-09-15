const express = require('express')
const router = new express.Router()
const { Ventes } = global.db
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
            const { Date_Evenement, Client, Formule_Aperitif, Formule_Cocktail, Formule_Box, Formule_Brunch } = elt

            // mise à 0 si pas de formule
            const String_Formule_Aperitif = `Apéritif (${Formule_Aperitif === null ? 0 : Formule_Aperitif.Nb_Convives + ' / ' + Formule_Aperitif.Nb_Pieces_Salees})`
            const String_Formule_Cocktail = `Cocktail (${Formule_Cocktail === null ? 0 : Formule_Cocktail.Nb_Convives + ' / ' + Formule_Cocktail.Nb_Pieces_Salees + ' / ' + Formule_Cocktail.Nb_Pieces_Sucrees})`
            const String_Formule_Box = `Box (${Formule_Box === null ? 0 : Formule_Box.Nb_Convives})`
            const String_Formule_Brunch = `Brunch (${Formule_Brunch === null ? 0 : Formule_Brunch.Nb_Convives + ' / ' + Formule_Brunch.Nb_Pieces_Salees + ' / ' + Formule_Brunch.Nb_Pieces_Sucrees})`
            
            let title = `${Client.Prenom} ${Client.Nom} : ${String_Formule_Aperitif} - ${String_Formule_Cocktail} - ${String_Formule_Box} - ${String_Formule_Brunch}`
            let url = ''

            if(elt instanceof Estimations) {
                url = `/estimations`
            }
            else if(elt instanceof Devis) {
                url = `/devis/${elt.Id_Devis}`
                title = `[${elt.Statut}] ${title}`
            }

            const event = {
                title,
                start : Date_Evenement,
                allDay : false,
                url,
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
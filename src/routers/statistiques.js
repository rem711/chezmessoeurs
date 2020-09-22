const express = require('express')
const router = new express.Router()
const { Ventes, Clients, Factures, sequelize } = global.db
const { Op, QueryTypes } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const moment = require('moment')
const { getRetardPaiementStatus } = require('./factures')

const months = {
    'January' : 'Janvier',
    'February' : 'Février',
    'March' : 'Mars',
    'April' : 'Avril',
    'May' : 'Mai',
    'June' : 'Juin',
    'July' : 'Juillet',
    'August' : 'Août',
    'September' : 'Septembre',
    'October' : 'Octobre',
    'November' : 'Novembre',
    'December' : 'Décembre'
}

router
// statistiques
.get('/statistiques', (req, res) => {
    res.render('index', {
        isStatistiques : true
    })
})
.get('/statistiques/factures/en-attente', async (req, res) => {
    let infos = undefined
    let factures = undefined

    try {
        factures = await Factures.findAll({
            include : {
                all : true,
                nested : true
            },
            where : {
                IsPayed : false,
                IsCanceled : false
            },
            order : [[sequelize.col('Vente.Date_Evenement'), 'ASC']]
        })

        if(factures === null) throw 'Une erreur est survenue lors de la récupération des factures en attente.'
        if(factures.length === 0) {
            infos = clientInformationObject(undefined, 'Aucune facture en attente.')
        }
        else {
            factures = factures.filter(facture => getRetardPaiementStatus(facture.Created_At, facture.Date_Paiement_Du) === 'En attente')

            if(factures.length === 0) {
                infos = clientInformationObject(undefined, 'Aucune facture en attente.')
            }
        }
    }
    catch(error) {
        factures = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        factures
    })
})
.get('/statistiques/factures/en-retard', async (req, res) => {
    let infos = undefined
    let factures = undefined

    try {
        factures = await Factures.findAll({
            include : {
                all : true,
                nested : true
            },
            where : {
                IsPayed : false,
                IsCanceled : false
            },
            order : [[sequelize.col('Vente.Date_Evenement'), 'ASC']]
        })

        if(factures === null) throw 'Une erreur est survenue lors de la récupération des factures en retard.'
        if(factures.length === 0) {
            infos = clientInformationObject(undefined, 'Aucune facture en retard.')
        }
        else {
            factures = factures
                .map(facture => {
                    facture = JSON.parse(JSON.stringify(facture))
                    facture.retard = getRetardPaiementStatus(facture.Created_At, facture.Date_Paiement_Du)
                    
                    return facture
                })
                .filter(facture => facture.retard !== 'En attente')

            if(factures.length === 0) {
                infos = clientInformationObject(undefined, 'Aucune facture en retard.')
            }
        }
    }
    catch(error) {
        factures = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        factures
    })
})
.get('/statistiques/ventes/prochaines', async (req, res) => {
    let infos = undefined
    let ventes = undefined

    try {
        const today = moment().format('YYYY-MM-DD 00:00:00')

        ventes = await Ventes.findAll({
            include : Clients,
            where : {
                Date_Evenement : {
                    [Op.gte] : today
                }
            },
            order : [['Date_Evenement', 'ASC']]
        })

        if(ventes === null) throw 'Une erreur est survenue lors de la récupération des prochaines prestations.'
        if(ventes.length === 0) infos = clientInformationObject(undefined, 'Aucune prestation à venir.')
    }
    catch(error) {
        ventes = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        ventes
    })
})
.get('/statistiques/ventes/nbVentes', async (req, res) => {
    let infos = undefined
    let data = undefined

    try {
        const currentYear = moment().format('YYYY')
        data = await sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, count(*) AS nb_ventes FROM Ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })

        if(data === null) throw "Une erreur s'est produite lors de la récupération du nombre de ventes par mois."
        if(data.length === 0) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {         
            data = {
                labels : data.map(elt => months[elt.mois]),
                datasets : [{
                    label : `Prestations / Mois en ${moment().format('YYYY')}`,
                    data : data.map(elt => elt.nb_ventes)
                }]
            }
        }
    }
    catch(error) {
        data = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        data
    })
})
.get('/statistiques/ventes/CAVentes', async (req, res) => {
    let infos = undefined
    let data = undefined

    try {
        const currentYear = moment().format('YYYY')
        data = await sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, SUM(Prix_TTC) AS CA FROM Ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })

        if(data === null) throw "Une erreur s'est produite lors de la récupération du nombre de ventes par mois."
        if(data.length === 0) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {         
            data = {
                labels : data.map(elt => months[elt.mois]),
                datasets : [{
                    label : `CA / Mois en ${moment().format('YYYY')}`,
                    data : data.map(elt => Number(Math.round((elt.CA + Number.EPSILON) * 100) / 100).toFixed(2))
                }]
            }
        }
    }
    catch(error) {
        data = undefined
        infos = clientInformationObject(getErrorMessage(error))
    }

    res.send({
        infos,
        data
    })
})

module.exports = router
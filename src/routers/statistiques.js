const express = require('express')
const router = new express.Router()
const { Ventes, Clients, Factures, sequelize } = global.db
const { Op, QueryTypes } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const isSet = require('../utils/isSet')
const moment = require('moment')
const { getRetardPaiementStatus } = require('./factures')

const translateMonths = {
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

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

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
        const previousYear = moment().subtract(1, 'year').format('YYYY')

        const [data_previousYear, data_currentYear] = await Promise.all([
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, count(*) AS nb_ventes FROM ventes WHERE YEAR(Date_Evenement)='${previousYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT }),
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, count(*) AS nb_ventes FROM ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })            
        ])

        if(data_previousYear === null || data_currentYear === null) throw "Une erreur s'est produite lors de la récupération du nombre de ventes par mois."
        if(data_previousYear.length === 0 && data_currentYear.length === 0) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {      
            const data_currentYear_filtered = []
            const data_previousYear_filtered = []

            // filtre les données pour faire correspondre les mois
            // si un moi sn'est pas présent c'est qu'il n'y a pas eu de vente, donc on le met à zéro
            for(const mois of months) {
                let value = undefined

                // sur previousYear
                value = data_previousYear.find(elt => translateMonths[elt.mois] === mois)
                if(value) {
                    data_previousYear_filtered.push(value.nb_ventes)
                }
                else {
                    data_previousYear_filtered.push(0)
                }

                // sur currentYear
                value = data_currentYear.find(elt => translateMonths[elt.mois] === mois)
                if(value) {
                    data_currentYear_filtered.push(value.nb_ventes)
                }
                else {
                    data_currentYear_filtered.push(0)
                }
            }

            data = {
                labels : months,
                datasets : [
                    {
                        label : `Prestations / Mois en ${previousYear}`,
                        data : data_previousYear_filtered
                    },
                    {
                        label : `Prestations / Mois en ${currentYear}`,
                        data : data_currentYear_filtered
                    }
                ]
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
        const previousYear = moment().subtract(1, 'year').format('YYYY')
        const [data_previousYear, data_currentYear] = await Promise.all([
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, SUM(Prix_TTC) AS CA FROM ventes WHERE YEAR(Date_Evenement)='${previousYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT }),
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, SUM(Prix_TTC) AS CA FROM ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })
        ])

        if(data_previousYear === null || data_currentYear === null) throw "Une erreur s'est produite lors de la récupération du nombre de ventes par mois."
        if(data_previousYear.length === 0 && data_currentYear.length === 0) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {  
            const data_currentYear_filtered = []
            const data_previousYear_filtered = []
            
            // filtre les données pour faire correspondre les mois
            // si un moi sn'est pas présent c'est qu'il n'y a pas eu de vente, donc on le met à zéro
            for(const mois of months) {
                let value = undefined

                // sur previousYear
                value = data_previousYear.find(elt => translateMonths[elt.mois] === mois)
                if(value) {
                    data_previousYear_filtered.push(Number(Math.round((value.CA + Number.EPSILON) * 100) / 100).toFixed(2))
                }
                else {
                    data_previousYear_filtered.push(0)
                }

                // sur currentYear
                value = data_currentYear.find(elt => translateMonths[elt.mois] === mois)
                if(value) {
                    data_currentYear_filtered.push(Number(Math.round((value.CA + Number.EPSILON) * 100) / 100).toFixed(2))
                }
                else {
                    data_currentYear_filtered.push(0)
                }
            }


            data = {
                labels : months,
                datasets : [
                    {
                        label : `CA / Mois en ${previousYear}`,
                        data : data_previousYear_filtered
                    },
                    {
                        label : `CA / Mois en ${currentYear}`,
                        data : data_currentYear_filtered
                    }
                ]
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
.get('/statistiques/ventes/moyennes', async (req, res) => {
    let infos = undefined
    let data = undefined

    try {
        const currentYear = moment().format('YYYY')
        const previousYear = moment().subtract(1, 'year').format('YYYY')

        const [nb_months_previousYear, sum_months_previousYear] = await Promise.all([
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, count(*) AS nb_ventes FROM ventes WHERE YEAR(Date_Evenement)='${previousYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT }),
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, SUM(Prix_TTC) AS CA FROM ventes WHERE YEAR(Date_Evenement)='${previousYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })
        ])

        const [nb_months_currentYear, sum_months_currentYear] = await Promise.all([
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, count(*) AS nb_ventes FROM ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT }),
            sequelize.query(`SELECT MONTHNAME(Date_Evenement) AS mois, SUM(Prix_TTC) AS CA FROM ventes WHERE YEAR(Date_Evenement)='${currentYear}' GROUP BY mois ORDER BY Date_Evenement ASC`, { type: QueryTypes.SELECT })
        ])

        if(nb_months_currentYear === null || sum_months_currentYear === null || nb_months_previousYear === null || sum_months_previousYear === null) throw "Une erreur s'est produite lors de la récupération du panier moyen par mois."
        if((nb_months_currentYear.length === 0 || sum_months_currentYear.length === 0) && (nb_months_previousYear.length === 0 || sum_months_previousYear.length === 0)) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {         
            const data_currentYear_filtered = []
            const data_previousYear_filtered = []

            // filtre les données pour faire correspondre les mois
            // si un moi sn'est pas présent c'est qu'il n'y a pas eu de vente, donc on le met à zéro
            for(const mois of months) {
                let index = -1

                // sur previousYear
                index = nb_months_previousYear.findIndex(elt => translateMonths[elt.mois] === mois)
                if(index !== -1) {
                    data_previousYear_filtered.push(Number(Math.round(((sum_months_previousYear[index].CA / nb_months_previousYear[index].nb_ventes) + Number.EPSILON) * 100) / 100).toFixed(2))
                }
                else {
                    data_previousYear_filtered.push(0)
                }

                // sur currentYear
                index = nb_months_currentYear.findIndex(elt => translateMonths[elt.mois] === mois)
                if(index !== -1) {
                    data_currentYear_filtered.push(Number(Math.round(((sum_months_currentYear[index].CA / nb_months_currentYear[index].nb_ventes) + Number.EPSILON) * 100) / 100).toFixed(2))
                }
                else {
                    data_currentYear_filtered.push(0)
                }
            }

            // const average_months = []
            // for(let i = 0; i < nb_months_currentYear.length; i++) {
            //     average_months[i] = Number(Math.round(((sum_months_currentYear[i].CA / nb_months_currentYear[i].nb_ventes) + Number.EPSILON) * 100) / 100).toFixed(2)
            // }

            data = {
                labels : months,
                datasets : [
                    {
                        label : `Panier moyen / Mois en ${previousYear}`,
                        data : data_previousYear_filtered
                    },
                    {
                        label : `Panier moyen / Mois en ${currentYear}`,
                        data : data_currentYear_filtered
                    }
                ]
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
.get('/statistiques/ventes/moyennes_annees', async (req, res) => {
    let infos = undefined
    let data = undefined

    try {
        const [nb_year, sum_year] = await Promise.all([
            sequelize.query(`SELECT YEAR(Date_Evenement) AS annee, count(*) AS nb_ventes FROM ventes GROUP BY annee ORDER BY annee ASC`, { type: QueryTypes.SELECT }),
            sequelize.query(`SELECT YEAR(Date_Evenement) AS annee, SUM(Prix_TTC) AS CA FROM ventes GROUP BY annee ORDER BY annee ASC`, { type: QueryTypes.SELECT })
        ])

        if(nb_year === null || sum_year === null) throw "Une erreur s'est produite lors de la récupération du panier moyen annuel."
        if(nb_year.length === 0 || sum_year.length === 0) {
            data = undefined
            infos = clientInformationObject(undefined, "Aucune donnée disponible.")
        }
        else {         
            const average_years = []
            for(let i = 0; i < nb_year.length; i++) {
                average_years[i] = Number(Math.round(((sum_year[i].CA / nb_year[i].nb_ventes) + Number.EPSILON) * 100) / 100).toFixed(2)
            }

            data = {
                labels : nb_year.map(elt => [elt.annee]),
                datasets : [{
                    label : `Panier moyen annuel`,
                    data : average_years
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
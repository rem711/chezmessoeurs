const express = require('express')
const router = new express.Router()
const { Clients, Estimations, Formules } = global.db
const { Op } = require('sequelize')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

router
// création estimation
.post('/estimations', async (req, res) => {
    // récupération des données de l'estimation
    const postEstimation = req.query

    // init valeurs retour
    let infos = undefined
    let client = undefined // client récupéré ou créé avec l'estimation
    let estimation = undefined
    

    // renvoie à la calculette s'il y a des erreurs
    res.send({
        infos,
        estimation
    })
})
// tableau estimations
.get('/estimations', async (req, res) => {
    let infos = undefined

    let estimations = undefined
    const temp_estimations = await Estimations.findAll({
        where : {
            Statut : null
        },
        include : Clients 
    })

    if(temp_estimations === null) {
        infos = errorHandler('Une erreur s\'est produite, impossible de charger les estimations.', undefined)        
    }
    else if(temp_estimations.length === 0) {
        infos = (undefined, 'Il n\' a pas d\'estimation.')
    }
    else {
        estimations = []
        // temp_estimations.forEach(e => {
        for(const e of temp_estimations) {
            const { Id_Estimation, Date_Creation, Client, Date_Evenement, Id_Formule_Aperitif, Id_Formule_Cocktail, Id_Formule_Box, Id_Formule_Brunch, Commentaire, Statut } = e
                        
            let Formule_Aperitif = null;
            let Formule_Cocktail = null;
            let Formule_Box = null;
            let Formule_Brunch = null;

            // récupération des formules
            if(Id_Formule_Aperitif !== null) {
                Formule_Aperitif = await Formules.findOne({
                    where : {
                        Id_Formule : Id_Formule_Aperitif
                    }
                })
            }
            if(Id_Formule_Cocktail !== null) {
                Formule_Cocktail = await Formules.findOne({
                    where : {
                        Id_Formule : Id_Formule_Cocktail
                    }
                })
            }
            if(Id_Formule_Box !== null) {
                Formule_Box = await Formules.findOne({
                    where : {
                        Id_Formule : Id_Formule_Box
                    }
                })
            }
            if(Id_Formule_Brunch) {
                Formule_Brunch = await Formules.findOne({
                    where : {
                        Id_Formule : Id_Formule_Brunch
                    }
                })
            }

            // mise à 0 si pas de formule
            const String_Formule_Aperitif = Formule_Aperitif === null ? 0 : Formule_Aperitif.Nb_Convives + ' / ' + Formule_Aperitif.Nb_Pieces_Salees
            const String_Formule_Cocktail = Formule_Cocktail === null ? 0 : Formule_Cocktail.Nb_Convives + ' / ' + Formule_Cocktail.Nb_Pieces_Salees + ' / ' + Formule_Cocktail.Nb_Pieces_Sucrees
            const String_Formule_Box = Formule_Box === null ? 0 : Formule_Box.Nb_Convives
            const String_Formule_Brunch = Formule_Brunch === null ? 0 : Formule_Brunch.Nb_Convives + ' / ' + Formule_Brunch.Nb_Pieces_Salees + ' / ' + Formule_Brunch.Nb_Pieces_Sucrees
            
            const estimation = {
                Id_Estimation,
                Date_Creation,
                Client,
                Date_Evenement,
                Commentaire,
                Statut,
                String_Formule_Aperitif,
                String_Formule_Cocktail,
                String_Formule_Box,
                String_Formule_Brunch
            }
            estimations.push(estimation)
        }
    }
    
    res.render('index', {
        isEstimations : true,
        infos,
        estimations,
        moment,
        formatDateHeure
    })
})
// 

module.exports = router
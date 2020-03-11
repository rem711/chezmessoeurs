const express = require('express')
const router = new express.Router()
const { Clients, Estimations, Formules } = global.db
const { createOrLoadClient }  = require('./clients')
const gestionTypeFormule = require('../utils/gestion_type_formule')
const gestionFormules = require('../utils/gestion_formules')
const { Op } = require('sequelize')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

router
// TODO
// création estimation
.post('/estimations', async (req, res) => {
    // récupération des données de l'estimation
    const postEstimation = req.query

    // init valeurs retour
    let infos = undefined
    let client = undefined // client récupéré ou créé avec l'estimation
    let estimation = undefined

    // crée ou récupère le client si déjà existant
    const createRes = await createOrLoadClient( {
        Nom_Prenom : postEstimation.Nom_Prenom,
        Email : postEstimation.Email,
        Telephone : postEstimation.Telephone,
        Type : postEstimation.Type
    })
    infos = createRes.infos
    client = createRes.client

    // s'il n'y a pas d'erreur lors de la création du client ou de sa récupération (paramètres invalides)
    if(client !== undefined) {
        // d'abord création des formules
        // définition des éléments par formule
        //// ici

        // puis création de l'estimation
        try {
            
        }
        catch(error) {

        }
    }

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
// valide estimation pour créer un devis
// récupère les infos, archive l'estimation, envoi sur devis pour le créer, renvoie sur la page du devis complet
.post('/estimations/validation/:Id_Estimation', async (req, res) => {

})
// archive une estimation
.patch('/estimations/:Id_Estimation', async (req, res) => {
    const getId_Estimation = req.params.Id_Estimation

    let infos = undefined

    try {
        const estimation = await Estimations.findOne({
            where : {
                Id_Estimation : getId_Estimation
            }
        })

        if(estimation !== null) {
            archiveEstimation(estimation)
            infos = errorHandler(undefined, 'L\'estimation a bien été archivée.')
        }
        else {
            infos = errorHandler('L\'estimation n\'existe pas.', undefined)
        }
    }
    catch(error) {
        infos = errorHandler(error, undefined)
    }

    res.send({
        infos
    })
})

// supprime une estimation
.delete('/estimations/:Id_Estimation', async (req, res) => {
    const getId_Estimation = req.params.Id_Estimation

    let infos = undefined

    try {
        const estimation = await Estimations.findOne({
            where : {
                Id_Estimation : getId_Estimation
            }
        })

        if(estimation !== null) {
            await estimation.destroy()
            infos = errorHandler(undefined, 'L\'estimation a bien été supprimée.')
        }
        else {
            infos = errorHandler('L\'estimation n\'existe pas.', undefined)
        }
    }
    catch(error) {
        infos = errorHandler(error, undefined)
    }

    res.send({
        infos
    })
})

const archiveEstimation = async (estimation) => {
    estimation.Statut = 'Archivé'
    await estimation.save()
}


module.exports = router
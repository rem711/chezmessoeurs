const express = require('express')
const router = new express.Router()
const cors = require('cors')
const { Clients, Estimations, Formules } = global.db
const { createOrLoadClient }  = require('./clients')
const gestionTypeFormule = require('../utils/gestion_type_formule')
const gestionFormules = require('../utils/gestion_formules')
const createDevis = require('./devis').createDevis
const { Op } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'


router
// création estimation
// cors enable for this route only
.options('/estimations', cors()) // option is for preflight option sent before request for certain cors request as when using fetch
.post('/estimations', cors(), async (req, res) => {
    // récupération des données de l'estimation
    const postEstimation = req.body
    
    // init valeurs retour
    let infos = undefined
    let client = undefined // client récupéré ou créé avec l'estimation
    let estimation = undefined

    try {
        // crée ou récupère le client si déjà existant
        // const createRes = await createOrLoadClient( {
        //     Nom_Prenom : postEstimation.Nom_Prenom,
        //     Email : postEstimation.Email,
        //     Telephone : postEstimation.Telephone,
        //     Type : postEstimation.Type
        // })
        // infos = createRes.infos
        // client = createRes.client
        client = await createOrLoadClient( {
            Nom_Prenom : postEstimation.Nom_Prenom,
            Email : postEstimation.Email,
            Telephone : postEstimation.Telephone,
            Type : postEstimation.Type
        })

        // s'il n'y a pas d'erreur lors de la création du client ou de sa récupération (paramètres invalides)
        if(client !== undefined) {
            // on crée les différentes formules
            const formulesRes = await gestionFormules.createFormules(postEstimation)
            // const { Formule_Aperitif, Formule_Cocktail, Formule_Box, Formule_Brunch } = 
            const idFormuleAperitif = formulesRes.Formule_Aperitif ? formulesRes.Formule_Aperitif.Id_Formule : formulesRes.Formule_Aperitif
            const idFormuleCocktail = formulesRes.Formule_Cocktail ? formulesRes.Formule_Cocktail.Id_Formule : formulesRes.Formule_Cocktail
            const idFormuleBox = formulesRes.Formule_Box ? formulesRes.Formule_Box.Id_Formule : formulesRes.Formule_Box
            const idFormuleBrunch = formulesRes.Formule_Brunch ? formulesRes.Formule_Brunch.Id_Formule : formulesRes.Formule_Brunch
            // infos = formulesRes.infos

            // il n'y a pas eu d'erreur(s) en créant les formules
            // sinon l'erreur est déjà définie et sera renvoyée
            // trim du commentaire si possible
            postEstimation.Commentaire = postEstimation.Commentaire === undefined ? null : postEstimation.Commentaire.trim()

            // puis création de l'estimation
            try {
                estimation = await Estimations.create({
                    Id_Client : client.Id_Client,
                    Date_Evenement : moment.utc(postEstimation.Date_Evenement),
                    Id_Formule_Aperitif : idFormuleAperitif,
                    Id_Formule_Cocktail : idFormuleCocktail,
                    Id_Formule_Box : idFormuleBox,
                    Id_Formule_Brunch : idFormuleBrunch,
                    Commentaire : postEstimation.Commentaire
                })

                // on met à jour le Dernier_Statut du client si l'estimation a été créée
                client.Dernier_Statut = 'Estimation en cours'
                await Clients.update(
                    {
                        Dernier_Statut : client.Dernier_Statut
                    },
                    {
                        where : {
                            Email : client.Email
                        }
                    }
                )

                infos = clientInformationObject(undefined, 'ok')
            }
            catch(error) {
                // infos = clientInformationObject(getErrorMessage(error), undefined)
                console.log(error)
                throw getErrorMessage(error)
            }
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
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
        order : [
            ['Date_Evenement', 'ASC']
        ],
        where : {
            [Op.or] : [
                {Statut : {[Op.notLike] : 'Archivé'}},
                {Statut : null}
            ]
        },
        include : Clients 
    })

    if(temp_estimations === null) {
        infos = clientInformationObject('Une erreur s\'est produite, impossible de charger les estimations.', undefined)        
    }
    else if(temp_estimations.length === 0) {
        infos = clientInformationObject(undefined, 'Aucune estimation')
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
    const postIdEstimation = req.params.Id_Estimation

    let infos = undefined
    let devis = undefined

    const temp_estimation = await Estimations.findOne({
        where : {
            Id_Estimation : postIdEstimation
        },
        include : [
            { model : Clients },
            { model : Formules, as : 'Formule_Aperitif' },
            { model : Formules, as : 'Formule_Cocktail' },
            { model : Formules, as : 'Formule_Box' },
            { model : Formules, as : 'Formule_Brunch' }
        ]
    })

    try {
        // on vérifie que l'estimation existe
        if(temp_estimation !== null) {
            devis = await createDevis(temp_estimation)

            // le devis a bien été créé
            infos = clientInformationObject(undefined, `Le devis pour l'évènement du ${moment(devis.Date_Evenement).format(formatDateHeure)} vient d'être créé.`)
        }
        else {
            throw 'Une erreur s\'est produite, veuillez actualiser la page et réessayer.'
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        devis
    })
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

            await Clients.update(
                {
                    Dernier_Statut : 'Estimation archivée'
                },
                {
                    where : {
                        Id_Client : estimation.Id_Client
                    }
                }
            )

            infos = clientInformationObject(undefined, 'L\'estimation a bien été archivée.')
        }
        else {
            infos = clientInformationObject('L\'estimation n\'existe pas.', undefined)
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
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
            infos = clientInformationObject(undefined, 'L\'estimation a bien été supprimée.')
        }
        else {
            infos = clientInformationObject('L\'estimation n\'existe pas.', undefined)
        }
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
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
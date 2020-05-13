const express = require('express')
const router = new express.Router()
const ejs = require('ejs')
const { Devis, Clients, Estimations, Formules, Recettes, Prix_Unitaire, Factures } = global.db
const isSet = require('../utils/isSet')
const { tableCorrespondanceTypes, modifyFormule, createFormules } = require('../utils/gestion_formules')
const { createOrLoadClient, updateClient }  = require('./clients')
const { checksListeOptions } = require('../utils/gestion_prix_unitaire')
const { createOrLoadRemise, getRemise } = require('../utils/gestion_remise')
const formatNumeroDevis = require('../utils/numeroFormatter')
const createPDF = require('../utils/pdf/pdf_devis')
const { createFacture } = require('./factures')
const { Op } = require('sequelize')
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const moment = require('moment')
const formatDateHeure = 'DD/MM/YYYY HH:mm'

const createDevis = async (estimation) => {
    let devis = undefined

    // cas où le devis est créé directement, en dehors d'une estimation
    if(estimation.isCreation) {
        //  créer les formules
        // paramètres pour la création des formules
        const params = {} 

        // Aperitif
        if(estimation.Formule_Aperitif.isAperitif) {
            params.isAperitif = estimation.Formule_Aperitif.isAperitif
            params.nbConvivesAperitif = estimation.Formule_Aperitif.Nb_Convives
            params.nbPiecesSaleesAperitif = estimation.Formule_Aperitif.Nb_Pieces_Salees
        }
        // Cocktail
        if(estimation.Formule_Cocktail.isCocktail) {
            params.isCocktail = estimation.Formule_Cocktail.isCocktail
            params.nbConvivesCocktail = estimation.Formule_Cocktail.Nb_Convives
            params.nbPiecesSaleesCocktail = estimation.Formule_Cocktail.Nb_Pieces_Salees
            params.nbPiecesSucreesCocktail = estimation.Formule_Cocktail.Nb_Pieces_Sucrees
        }
        // Box
        if(estimation.Formule_Box.isBox) {
            params.isBox = estimation.Formule_Box.isBox
            params.nbConvivesBox = estimation.Formule_Box.Nb_Convives
        }
        // Brunch
        if(estimation.Formule_Brunch.isBrunch) {
            params.isBrunch = estimation.Formule_Brunch.isBrunch
            params.typeBrunchSale = undefined
            params.typeBrunchSucre = undefined
            params.nbConvivesBrunch = estimation.Formule_Brunch.Nb_Convives
            params.isBrunchSale = estimation.Formule_Brunch.isBrunchSale
            params.isBrunchSucre = estimation.Formule_Brunch.isBrunchSucre
            if(estimation.Formule_Brunch.isBrunchSale) {                    
                params.typeBrunchSale = estimation.Formule_Brunch.Nb_Pieces_Salees == tableCorrespondanceTypes['Brunch'].nbPieces['salées'].min ? 'Petite Faim' : 'Grande Faim'
            }
            if(estimation.Formule_Brunch.isBrunchSucre) {
                params.typeBrunchSucre = estimation.Formule_Brunch.Nb_Pieces_Sucrees == tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].min ? 'Petite Faim' : 'Grande Faim'
            }
        }
        
        const formules = await createFormules(params)

        // créer ou trouver client        
        let client = await createOrLoadClient( {
            Nom : estimation.client.Nom.trim(),
            Prenom : estimation.client.Prenom.trim(),
            Email : estimation.client.Email.trim(),
            Telephone : estimation.client.Telephone.trim()
        })

        // FIXME:
        client = await updateClient(client.Id_Client, estimation.client)

        // ajout des nouvelles informations à la fausse estimation
        estimation.Id_Estimation = null
        estimation.Id_Client = client.Id_Client
        estimation.Id_Formule_Aperitif = formules.Formule_Aperitif ? formules.Formule_Aperitif.Id_Formule : formules.Formule_Aperitif
        estimation.Id_Formule_Cocktail = formules.Formule_Cocktail ? formules.Formule_Cocktail.Id_Formule : formules.Formule_Cocktail
        estimation.Id_Formule_Box = formules.Formule_Box ? formules.Formule_Box.Id_Formule : formules.Formule_Box
        estimation.Id_Formule_Brunch = formules.Formule_Brunch ? formules.Formule_Brunch.Id_Formule : formules.Formule_Brunch

        estimation.Formule_Aperitif = formules.Formule_Aperitif
        estimation.Formule_Cocktail = formules.Formule_Cocktail
        estimation.Formule_Box = formules.Formule_Box
        estimation.Formule_Brunch = formules.Formule_Brunch
        estimation.Client = client
    }

    
    // gestion des prix
    let prixHT = 0
    let prixTTC = 0

    if(estimation.Formule_Aperitif !== null) {
        prixHT += estimation.Formule_Aperitif.Prix_HT
    }
    if(estimation.Formule_Cocktail !== null) {
        prixHT += estimation.Formule_Cocktail.Prix_HT
    }
    if(estimation.Formule_Box !== null) {
        prixHT += estimation.Formule_Box.Prix_HT
    }
    if(estimation.Formule_Brunch !== null) {
        prixHT += estimation.Formule_Brunch.Prix_HT
    }

    prixTTC = prixHT * 1.1

    let Adresse_Livraison_Adresse = estimation.Client.Adresse_Facturation_Adresse
    let Adresse_Livraison_Adresse_Complement_1 = estimation.Client.Adresse_Facturation_Adresse_Complement_1
    let Adresse_Livraison_Adresse_Complement_2 = estimation.Client.Adresse_Facturation_Adresse_Complement_2
    let Adresse_Livraison_CP = estimation.Client.Adresse_Facturation_CP
    let Adresse_Livraison_Ville = estimation.Client.Adresse_Facturation_Ville
    if(estimation.isCreation && isSet(estimation.Adresse_Livraison_Adresse) && isSet(estimation.Adresse_Livraison_CP) && isSet(estimation.Adresse_Livraison_Ville)) {
        Adresse_Livraison_Adresse = estimation.Adresse_Livraison_Adresse
        Adresse_Livraison_Adresse_Complement_1 = isSet(estimation.Adresse_Livraison_Adresse_Complement_1) ? estimation.Adresse_Livraison_Adresse_Complement_1 : ''
        Adresse_Livraison_Adresse_Complement_2 = isSet(estimation.Adresse_Livraison_Adresse_Complement_2) ? estimation.Adresse_Livraison_Adresse_Complement_2 : ''
        Adresse_Livraison_CP = estimation.Adresse_Livraison_CP
        Adresse_Livraison_Ville = estimation.Adresse_Livraison_Ville
    }

    const Liste_Options = estimation.Liste_Options !== undefined ? estimation.Liste_Options : null      

    const Id_Remise = estimation.Id_Remise !== undefined ? estimation.Id_Remise : null

    const Numero_Devis = `DE_${moment.utc().format('YYYYMMDD')}_****_${estimation.Client.Nom}`

    // création du devis
    devis = await Devis.create({
        Id_Estimation : estimation.Id_Estimation,
        Numero_Devis,
        Id_Client : estimation.Id_Client,
        Date_Evenement : moment.utc(estimation.Date_Evenement),
        Adresse_Livraison_Adresse,
        Adresse_Livraison_Adresse_Complement_1,
        Adresse_Livraison_Adresse_Complement_2,
        Adresse_Livraison_CP,
        Adresse_Livraison_Ville,
        Id_Formule_Aperitif : estimation.Id_Formule_Aperitif,
        Id_Formule_Cocktail : estimation.Id_Formule_Cocktail,
        Id_Formule_Box : estimation.Id_Formule_Box,
        Id_Formule_Brunch : estimation.Id_Formule_Brunch,
        Commentaire : estimation.Commentaire,
        Statut : 'En cours',
        Liste_Options : Liste_Options,
        Id_Remise : Id_Remise,
        Prix_HT : Number.parseFloat(prixHT).toFixed(2),
        Prix_TTC : Number.parseFloat(prixTTC).toFixed(2)
    })

    if(devis === null) {
        throw "Une erreur est survenue lors de la création du devis."
    }

    // si le devis est bien créé, on lui donne son vrai numéro
    // eslint-disable-next-line prefer-named-capture-group
    devis.Numero_Devis = devis.Numero_Devis.replace(/(\*){4}/g, formatNumeroDevis(devis.Id_Devis))
    await devis.save()

    // si l'on avait une estimation, on l'archive
    if(!estimation.isCreation) {
        // on archive l'estimation
        estimation.Statut = 'Archivée'
        await estimation.save()
    }

    // on met à jour le statut du client
    estimation.Client.Dernier_Statut = 'Devis en cours'
    await estimation.Client.save()      

    return devis
}

// prend une liste de devis, récupère et renvoie les infos utiles dans une liste de devis
const getListInfosDevis = async (listDevis) => {
    let listInfosDevis = []
    for(const d of listDevis) {
        const { Id_Devis, Client, Estimation, Date_Evenement, Id_Formule_Aperitif, Id_Formule_Cocktail, Id_Formule_Box, Id_Formule_Brunch, Commentaire } = d

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
        
        const devis = {
            Id_Devis,
            Client,
            Estimation,
            Date_Evenement,
            Commentaire,
            String_Formule_Aperitif,
            String_Formule_Cocktail,
            String_Formule_Box,
            String_Formule_Brunch
        }

        listInfosDevis.push(devis)
    }

    return listInfosDevis
}

const validate = async (postIdDevis) => {
    const devis = await Devis.findOne({
        where : {
            Id_Devis : postIdDevis
        },
        include : {
            all : true,
            nested : true
        }
    })

    if(devis === null) {
        throw 'Le devis demandé n\'existe pas.'
    }

    const message = `Le devis ${devis.Id_Devis} n'est pas complet. `

    // vérifier que le nombre de pièces correspond au nombre de recettes (exception pour box qui est soit égal soit nbconvives * nb recettesSalees = listeRecettes)
    if(devis.Id_Formule_Aperitif !== null) {
        // retrait du ';' final s'il y en a un
        if(devis.Formule_Aperitif.Liste_Id_Recettes_Salees === null) devis.Formule_Aperitif.Liste_Id_Recettes_Salees = ''
        if(devis.Formule_Aperitif.Liste_Id_Recettes_Salees[devis.Formule_Aperitif.Liste_Id_Recettes_Salees.length-1] === ';') devis.Formule_Aperitif.Liste_Id_Recettes_Salees = devis.Formule_Aperitif.Liste_Id_Recettes_Salees.substr(0, devis.Formule_Aperitif.Liste_Id_Recettes_Salees.length - 1)
        const tab_Id_Recettes_Salees = devis.Formule_Aperitif.Liste_Id_Recettes_Salees.split(';')
        // vérification que les recettes salées sont choisies
        if(devis.Formule_Aperitif.Liste_Id_Recettes_Salees === '' || tab_Id_Recettes_Salees.length !== devis.Formule_Aperitif.Nb_Pieces_Salees) {
            throw message + 'Les recettes de la formule Apéritif ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Aperitif.Liste_Id_Recettes_Boissons === null) devis.Formule_Aperitif.Liste_Id_Recettes_Boissons = ''
        if(devis.Formule_Aperitif.Liste_Id_Recettes_Boissons[devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.length-1] === ';') devis.Formule_Aperitif.Liste_Id_Recettes_Boissons = devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.substr(0, devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.length - 1)
        const tab_Id_Recettes_Boissons = devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.split(';')
        // vérification que les boissons sont choisies
        // if(devis.Formule_Aperitif.Liste_Id_Recettes_Boissons !== '' && tab_Id_Recettes_Boissons.length !== devis.Formule_Aperitif.Nb_Boissons) {
        //     throw message + 'Les recettes de la formule Apéritif ne sont pas toutes renseignées.'
        // }
    }
    if(devis.Id_Formule_Cocktail !== null) {
        // retrait du ';' final s'il y en a un
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Salees === null) devis.Formule_Cocktail.Liste_Id_Recettes_Salees = ''
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Salees[devis.Formule_Cocktail.Liste_Id_Recettes_Salees.length-1] === ';') devis.Formule_Cocktail.Liste_Id_Recettes_Salees = devis.Formule_Cocktail.Liste_Id_Recettes_Salees.substr(0, devis.Formule_Cocktail.Liste_Id_Recettes_Salees.length - 1)
        const tab_Id_Recettes_Salees = devis.Formule_Cocktail.Liste_Id_Recettes_Salees.split(';')
        // vérification que les recettes salées sont choisies
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Salees === '' || tab_Id_Recettes_Salees.length !== devis.Formule_Cocktail.Nb_Pieces_Salees) {
            throw message + 'Les recettes salées de la formule Cocktail ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees === null) devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees = ''
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees[devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length-1] === ';') devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees = devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.substr(0, devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length - 1)
        const tab_Id_Recettes_Sucrees = devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.split(';')
        // vérification que les recettes sucrées sont choisies
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees === '' || tab_Id_Recettes_Sucrees.length !== devis.Formule_Cocktail.Nb_Pieces_Sucrees) {
            throw message + 'Les recettes sucrées de la formule Cocktail ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Boissons === null) devis.Formule_Cocktail.Liste_Id_Recettes_Boissons = ''
        if(devis.Formule_Cocktail.Liste_Id_Recettes_Boissons[devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.length-1] === ';') devis.Formule_Cocktail.Liste_Id_Recettes_Boissons = devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.substr(0, devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.length - 1)
        const tab_Id_Recettes_Boissons = devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.split(';')
        // vérification que les recettes boissons sont choisies
        // if(devis.Formule_Cocktail.Liste_Id_Recettes_Boissons !== '' && tab_Id_Recettes_Boissons.length !== devis.Formule_Cocktail.Nb_Boissons) {
        //     throw message + 'Les recettes de la formule Cocktail ne sont pas toutes renseignées.'
        // }
    }
    if(devis.Id_Formule_Box !== null) {
        // retrait du ';' final s'il y en a un
        if(devis.Formule_Box.Liste_Id_Recettes_Salees === null) devis.Formule_Box.Liste_Id_Recettes_Salees = ''
        if(devis.Formule_Box.Liste_Id_Recettes_Salees[devis.Formule_Box.Liste_Id_Recettes_Salees.length-1] === ';') devis.Formule_Box.Liste_Id_Recettes_Salees = devis.Formule_Box.Liste_Id_Recettes_Salees.substr(0, devis.Formule_Box.Liste_Id_Recettes_Salees.length - 1)
        const tab_Id_Recettes_Salees = devis.Formule_Box.Liste_Id_Recettes_Salees.split(';')
        // vérification que les recettes salées sont choisies
        // pour une box il faut que le nb de recettes soit : soit égal au nombre de pièces, soit égal au nombre de pièces * le nombre de convives
        if(devis.Formule_Box.Liste_Id_Recettes_Salees === '' || !(tab_Id_Recettes_Salees.length === devis.Formule_Box.Nb_Pieces_Salees || tab_Id_Recettes_Salees.length === (devis.Formule_Box.Nb_Convives * devis.Formule_Box.Nb_Pieces_Salees))) {
            throw message + 'Les recettes salées de la formule Box ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Box.Liste_Id_Recettes_Sucrees === null) devis.Formule_Box.Liste_Id_Recettes_Sucrees = ''
        if(devis.Formule_Box.Liste_Id_Recettes_Sucrees[devis.Formule_Box.Liste_Id_Recettes_Sucrees.length-1] === ';') devis.Formule_Box.Liste_Id_Recettes_Sucrees = devis.Formule_Box.Liste_Id_Recettes_Sucrees.substr(0, devis.Formule_Box.Liste_Id_Recettes_Sucrees.length - 1)
        const tab_Id_Recettes_Sucrees = devis.Formule_Box.Liste_Id_Recettes_Sucrees.split(';')
        // vérification que les recettes sucrées sont choisies
        // pour une box il faut que le nb de recettes soit : soit égal au nombre de pièces, soit égal au nombre de pièces * le nombre de convives
        if(devis.Formule_Box.Liste_Id_Recettes_Sucrees === '' || !(tab_Id_Recettes_Sucrees.length === devis.Formule_Box.Nb_Pieces_Sucrees || tab_Id_Recettes_Sucrees.length === (devis.Formule_Box.Nb_Convives * devis.Formule_Box.Nb_Pieces_Sucrees))) {
            throw message + 'Les recettes sucrées de la formule Box ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Box.Liste_Id_Recettes_Boissons === null) devis.Formule_Box.Liste_Id_Recettes_Boissons = ''
        if(devis.Formule_Box.Liste_Id_Recettes_Boissons[devis.Formule_Box.Liste_Id_Recettes_Boissons.length-1] === ';') devis.Formule_Box.Liste_Id_Recettes_Boissons = devis.Formule_Box.Liste_Id_Recettes_Boissons.substr(0, devis.Formule_Box.Liste_Id_Recettes_Boissons.length - 1)
        const tab_Id_Recettes_Boissons = devis.Formule_Box.Liste_Id_Recettes_Boissons.split(';')
        // vérification que les recettes boissons sont choisies
        // pour une box il faut que le nb de recettes soit : soit égal au nombre de pièces, soit égal au nombre de pièces * le nombre de convives
        // if(devis.Formule_Box.Liste_Id_Recettes_Boissons !== '' && !(tab_Id_Recettes_Boissons.length !== devis.Formule_Box.Nb_Boissons || tab_Id_Recettes_Boissons.length !== (devis.Formule_Box.Nb_Convives * devis.Formule_Box.Nb_Boissons))) {
        //     throw message + 'Les recettes de la formule Box ne sont pas toutes renseignées.'
        // }
    }
    if(devis.Id_Formule_Brunch !== null) {
        // retrait du ';' final s'il y en a un
        if(devis.Formule_Brunch.Liste_Id_Recettes_Salees === null) devis.Formule_Brunch.Liste_Id_Recettes_Salees = ''
        if(devis.Formule_Brunch.Liste_Id_Recettes_Salees[devis.Formule_Brunch.Liste_Id_Recettes_Salees.length-1] === ';') devis.Formule_Brunch.Liste_Id_Recettes_Salees = devis.Formule_Brunch.Liste_Id_Recettes_Salees.substr(0, devis.Formule_Brunch.Liste_Id_Recettes_Salees.length - 1)
        const tab_Id_Recettes_Salees = devis.Formule_Brunch.Liste_Id_Recettes_Salees.split(';')
        // vérification que les recettes salées sont choisies
        if(devis.Formule_Brunch.Liste_Id_Recettes_Salees === '' || devis.Formule_Brunch.Liste_Id_Recettes_Salees !== '' && tab_Id_Recettes_Salees.length !== devis.Formule_Brunch.Nb_Pieces_Salees) {
            throw message + 'Les recettes salées de la formule Brunch ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Brunch.Liste_Id_Recettes_Sucrees === null) devis.Formule_Brunch.Liste_Id_Recettes_Sucrees = ''
        if(devis.Formule_Brunch.Liste_Id_Recettes_Sucrees[devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.length-1] === ';') devis.Formule_Brunch.Liste_Id_Recettes_Sucrees = devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.substr(0, devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.length - 1)
        const tab_Id_Recettes_Sucrees = devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.split(';')
        // vérification que les recettes sucrées sont choisies
        if(devis.Formule_Brunch.Liste_Id_Recettes_Sucrees === '' || tab_Id_Recettes_Sucrees.length !== devis.Formule_Brunch.Nb_Pieces_Sucrees) {
            throw message + 'Les recettes sucrées de la formule Brunch ne sont pas toutes renseignées.'
        }

        // retrait du ';' final s'il y en a un
        if(devis.Formule_Brunch.Liste_Id_Recettes_Boissons === null) devis.Formule_Brunch.Liste_Id_Recettes_Boissons = ''
        if(devis.Formule_Brunch.Liste_Id_Recettes_Boissons[devis.Formule_Brunch.Liste_Id_Recettes_Boissons.length-1] === ';') devis.Formule_Brunch.Liste_Id_Recettes_Boissons = devis.Formule_Brunch.Liste_Id_Recettes_Boissons.substr(0, devis.Formule_Brunch.Liste_Id_Recettes_Boissons.length - 1)
        const tab_Id_Recettes_Boissons = devis.Formule_Brunch.Liste_Id_Recettes_Boissons.split(';')
        // vérification que les recettes boissons sont choisies
        // if(devis.Formule_Brunch.Liste_Id_Recettes_Boissons !== '' && tab_Id_Recettes_Boissons.length !== devis.Formule_Brunch.Nb_Boissons) {
        //     throw message + 'Les recettes de la formule Brunch ne sont pas toutes renseignées.'
        // }
    }

    return devis
}

router
// crée un devis sans estimation existente
.get('/devis/create', async (req, res) => {
    let infos = undefined

    const devis = {
        Date_Evenement : moment.utc(),
        Client : {
            Id_Client : '',
            Type : 'Particulier'
        },
        Formule_Aperitif : null,
        Formule_Cocktail : null,
        Formule_Box : null,
        Formule_Brunch : null,
        Id_Remise : null
    }

    try {
        // récupération des recettes
        const listeRecettesSalees = await Recettes.findAll({
            where : {
                Categorie : 'Salée'
            }
        })
        const listeRecettesSucrees = await Recettes.findAll({
            where : {
                Categorie : 'Sucrée'
            }
        })
        const listeRecettesBoissons = await Recettes.findAll({
            where : {
                Categorie : 'Boisson'
            }
        })

        // récupération des options
        const listeOptions = await Prix_Unitaire.findAll({
            where : {
                isOption : true
            }
        })

        // récupération des différents prix
        const listePrix_unitaire = await Prix_Unitaire.findAll({}) 

        const values = {
            isDevisItem : true,
            infos,
            devis,
            moment,
            tableCorrespondanceTypes,
            listeRecettesSalees,
            listeRecettesSucrees,
            listeRecettesBoissons,
            listeOptions,
            listePrix_unitaire,
            isCreation : true
        }


        ejs.renderFile(__dirname + '/../views/index.html', values, (err, html) => {
            if(!err) {
                res.send(html)
            }
            else {
                throw err
            }            
        })
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)

        res.render('index', {
            isDevisItem : true,
            infos
        })
    }
})
// tableau devis
.get('/devis', async (req, res) => {
    // init les valeurs de retour
    const values = {
        'Général' : {
            infos : undefined
        },
        'En cours' : {
            infos : undefined,
            devis : undefined
        },
        'Envoyés' : {
            infos : undefined,
            devis : undefined
        },
        'Validés' : {   
            infos : undefined,
            devis : undefined
        }
    }

    try {
        // récupération des différentes listes de devis
        const temp_devisEnCours = await Devis.findAll({
            order : [
                ['Date_Evenement', 'ASC']
            ],
            where : {
                Statut : 'En cours'
            },
            include : [
                { model : Clients },
                { model : Estimations }
            ]
        })
        const temp_devisValidés = await Devis.findAll({
            order : [
                ['Date_Evenement', 'ASC']
            ],
            where : {
                Statut : 'Validé'
            },
            include : [
                { model : Clients },
                { model : Estimations }
            ]
        })
        const temp_devisEnvoyés = await Devis.findAll({
            order : [
                ['Date_Evenement', 'ASC']
            ],
            where : {
                Statut : 'Envoyé'
            },
            include : [
                { model : Clients },
                { model : Estimations }
            ]
        })

        // il y a un problème pour récupérer les devis
        if(temp_devisEnCours === null || temp_devisValidés === null || temp_devisEnvoyés === null) {
            throw 'Une erreur s\'est produite, impossible de charger les devis.'     
        }
        else {
            // indique s'il n'y a pas de devis dans la catégorie
            if(temp_devisEnCours.length === 0) {
                values['En cours'].infos = clientInformationObject(undefined, 'Aucun devis')
            }
            if(temp_devisEnvoyés.length === 0) {
                values['Envoyés'].infos = clientInformationObject(undefined, 'Aucun devis')
            }
            if(temp_devisValidés.length === 0) {
                values['Validés'].infos = clientInformationObject(undefined, 'Aucun devis')
            }

            // récupération et formatage des informations des devis
            if(temp_devisEnCours.length > 0) {
                values['En cours'].devis = await getListInfosDevis(temp_devisEnCours)            
            }
            if(temp_devisEnvoyés.length > 0) {
                values['Envoyés'].devis = await getListInfosDevis(temp_devisEnvoyés)
            }
            if(temp_devisValidés.length > 0) {
                values['Validés'].devis = await getListInfosDevis(temp_devisValidés)
            }
        }
    }
    catch(error) {
        values['En cours'].devis = undefined
        values['Envoyés'].devis = undefined
        values['Validés'].devis = undefined
        values['Général'].infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.render('index', {
        isDevis : true,
        values,
        moment,
        formatDateHeure
    })
})
// devis spécifique
.get('/devis/:Id_Devis', async (req, res) => {
    const getId = req.params.Id_Devis

    // init valeurs retour
    const values = { isDevisItem : true }
    let infos = undefined
    let devis = undefined

    try {
        devis = await Devis.findOne({
            where : {
                Id_Devis : getId
            },
            include : {
                all : true,
                nested : true
            }
        })

        // on verifie l'existence du devis
        if(devis !== null) { 
            // récupérations recettes sélectionnées
            let recettesSaleesAperitif = []
            let recettesBoissonsAperitif = []
            let recettesSaleesCocktail = []
            let recettesSucreesCocktail = []
            let recettesBoissonsCocktail = []
            let recettesSaleesBox = []
            let recettesSucreesBox = []
            let recettesBoissonsBox = []
            let recettesSaleesBrunch = []
            let recettesSucreesBrunch = []
            let recettesBoissonsBrunch = []

            if(devis.Formule_Aperitif) {
                let tabRecettesSalees = undefined
                let tabRecettesBoissons = undefined

                // récupération des recettes depuis les listes
                if(devis.Formule_Aperitif.Liste_Id_Recettes_Salees !== null) {
                    tabRecettesSalees = devis.Formule_Aperitif.Liste_Id_Recettes_Salees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSalees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSaleesAperitif = []
                    for(const Id_Recette of tabRecettesSalees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSaleesAperitif.push(recette)
                        }
                    }
                }
                if(devis.Formule_Aperitif.Liste_Id_Recettes_Boissons !== null) {
                    tabRecettesBoissons = devis.Formule_Aperitif.Liste_Id_Recettes_Boissons.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesBoissons.pop()

                    // on crée une liste où on poussera les recettes
                    recettesBoissonsAperitif = []
                    for(const Id_Recette of tabRecettesBoissons) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesBoissonsAperitif.push(recette)
                        }
                    }
                }

            }
            if(devis.Formule_Cocktail) {
                let tabRecettesSalees = undefined
                let tabRecettesSucrees = undefined
                let tabRecettesBoissons = undefined

                // récupération des recettes depuis les listes
                if(devis.Formule_Cocktail.Liste_Id_Recettes_Salees !== null) {
                    tabRecettesSalees = devis.Formule_Cocktail.Liste_Id_Recettes_Salees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSalees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSaleesCocktail = []
                    for(const Id_Recette of tabRecettesSalees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSaleesCocktail.push(recette)
                        }
                    }
                }
                if(devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees !== null) {
                    tabRecettesSucrees = devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSucrees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSucreesCocktail = []
                    for(const Id_Recette of tabRecettesSucrees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSucreesCocktail.push(recette)
                        }
                    }
                }
                if(devis.Formule_Cocktail.Liste_Id_Recettes_Boissons !== null) {
                    tabRecettesBoissons = devis.Formule_Cocktail.Liste_Id_Recettes_Boissons.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesBoissons.pop()

                    // on crée une liste où on poussera les recettes
                    recettesBoissonsCocktail = []
                    for(const Id_Recette of tabRecettesBoissons) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesBoissonsCocktail.push(recette)
                        }
                    }
                }
            }
            if(devis.Formule_Box) {
                let tabRecettesSalees = undefined
                let tabRecettesSucrees = undefined
                let tabRecettesBoissons = undefined

                // récupération des recettes depuis les listes
                if(devis.Formule_Box.Liste_Id_Recettes_Salees !== null) {
                    tabRecettesSalees = devis.Formule_Box.Liste_Id_Recettes_Salees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSalees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSaleesBox = []
                    for(const Id_Recette of tabRecettesSalees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSaleesBox.push(recette)
                        }
                    }
                }
                if(devis.Formule_Box.Liste_Id_Recettes_Sucrees !== null) {
                    tabRecettesSucrees = devis.Formule_Box.Liste_Id_Recettes_Sucrees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSucrees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSucreesBox = []
                    for(const Id_Recette of tabRecettesSucrees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSucreesBox.push(recette)
                        }
                    }
                }
                if(devis.Formule_Box.Liste_Id_Recettes_Boissons !== null) {
                    tabRecettesBoissons = devis.Formule_Box.Liste_Id_Recettes_Boissons.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesBoissons.pop()

                    // on crée une liste où on poussera les recettes
                    recettesBoissonsBox = []
                    for(const Id_Recette of tabRecettesBoissons) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesBoissonsBox.push(recette)
                        }
                    }
                }
            }
            if(devis.Formule_Brunch) {
                let tabRecettesSalees = undefined
                let tabRecettesSucrees = undefined
                let tabRecettesBoissons = undefined

                // récupération des recettes depuis les listes
                if(devis.Formule_Brunch.Liste_Id_Recettes_Salees !== null) {
                    tabRecettesSalees = devis.Formule_Brunch.Liste_Id_Recettes_Salees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSalees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSaleesBrunch = []
                    for(const Id_Recette of tabRecettesSalees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSaleesBrunch.push(recette)
                        }
                    }
                }
                if(devis.Formule_Brunch.Liste_Id_Recettes_Sucrees !== null) {
                    tabRecettesSucrees = devis.Formule_Brunch.Liste_Id_Recettes_Sucrees.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesSucrees.pop()

                    // on crée une liste où on poussera les recettes
                    recettesSucreesBrunch = []
                    for(const Id_Recette of tabRecettesSucrees) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesSucreesBrunch.push(recette)
                        }
                    }
                }
                if(devis.Formule_Brunch.Liste_Id_Recettes_Boissons !== null) {
                    tabRecettesBoissons = devis.Formule_Brunch.Liste_Id_Recettes_Boissons.split(';')
                    // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                    tabRecettesBoissons.pop()

                    // on crée une liste où on poussera les recettes
                    recettesBoissonsBrunch = []
                    for(const Id_Recette of tabRecettesBoissons) {
                        const recette = await Recettes.findOne({
                            where : {
                                Id_Recette : Id_Recette
                            }
                        })
                        if(recette !== null) {
                            recettesBoissonsBrunch.push(recette)
                        }
                    }
                }
            }

            let optionsSelectionnees = undefined
            let IdoptionsSelectionnees = []
            if(devis.Liste_Options !== null) {
                const tabOptions = devis.Liste_Options.split(';')
                // retire le dernier élément qui est vide puisqu'il y a toujours un ';' final
                tabOptions.pop()

                // on crée une liste où on poussera les recettes
                optionsSelectionnees = []
                for(const Id_Option of tabOptions) {
                    const option = await Prix_Unitaire.findOne({
                        where : {
                            Id_Prix_Unitaire : Id_Option
                        }
                    })
                    if(option !== null) {
                        optionsSelectionnees.push(option)
                        IdoptionsSelectionnees.push(option.Id_Prix_Unitaire)
                    }
                }
            }

            // récupération des recettes
            const listeRecettesSalees = await Recettes.findAll({
                where : {
                    Categorie : 'Salée'
                }
            })
            const listeRecettesSucrees = await Recettes.findAll({
                where : {
                    Categorie : 'Sucrée'
                }
            })
            const listeRecettesBoissons = await Recettes.findAll({
                where : {
                    Categorie : 'Boisson'
                }
            })

            // récupération des options
            const listeOptions = await Prix_Unitaire.findAll({
                where : {
                    isOption : true,
                    Id_Prix_Unitaire : {
                        [Op.notIn] : IdoptionsSelectionnees
                    }
                }
            })

            // récupération des différents prix
            const listePrix_unitaire = await Prix_Unitaire.findAll({}) 

            // affectation des valeurs de retour
            values.recettesSaleesAperitif = recettesSaleesAperitif
            values.recettesBoissonsAperitif = recettesBoissonsAperitif
            values.recettesSaleesCocktail = recettesSaleesCocktail
            values.recettesSucreesCocktail = recettesSucreesCocktail
            values.recettesBoissonsCocktail = recettesBoissonsCocktail
            values.recettesSaleesBox = recettesSaleesBox
            values.recettesSucreesBox = recettesSucreesBox
            values.recettesBoissonsBox = recettesBoissonsBox
            values.recettesSaleesBrunch = recettesSaleesBrunch
            values.recettesSucreesBrunch = recettesSucreesBrunch
            values.recettesBoissonsBrunch = recettesBoissonsBrunch
            values.optionsSelectionnees = optionsSelectionnees
            values.listeRecettesSalees = listeRecettesSalees
            values.listeRecettesSucrees = listeRecettesSucrees
            values.listeRecettesBoissons = listeRecettesBoissons
            values.listeOptions = listeOptions
            values.listePrix_unitaire = listePrix_unitaire
        }
        else {
            throw `Le devis n°${getId} n'existe pas.`
        }

        values.infos = infos
        values.devis = devis
        values.tableCorrespondanceTypes = tableCorrespondanceTypes
        values.moment = moment
        
        // essaie de rendu en amont pour un chargement de la page plus rapide
        ejs.renderFile(__dirname + '/../views/index.html', values, (err, html) => {
            if(!err) {
                res.send(html)
            }
            else {
                throw err
            }
        })
    }
    catch(error) {
        infos = clientInformationObject(error, undefined)
        res.render('index', {
            isDevisItem : true,
            infos
        })
    }
})
.get(`/devis/pdf/${encodeURI('CHEZ MES SOEURS - Devis ')}:Numero_Devis.pdf`, async (req, res) => {
    const postNumeroDevis = req.params.Numero_Devis    

    try {
        const temp_devis = await Devis.findOne({
            where : {
                Numero_Devis : postNumeroDevis
            }
        })

        if(temp_devis === null) {
            throw 'Le devis demandé n\'existe pas.'
        }

        // vérifie que le devis est valide
        const devis = await validate(temp_devis.Id_Devis)

        // objet du devis à envoyer pour la création du pdf
        const toPDF = {}
        toPDF.Id_Devis = devis.Id_Devis
        toPDF.Numero_Devis = devis.Numero_Devis
        toPDF.Date_Evenement = devis.Date_Evenement
        toPDF.Adresse_Livraison_Adresse = devis.Adresse_Livraison_Adresse
        toPDF.Adresse_Livraison_Adresse_Complement_1 = devis.Adresse_Livraison_Adresse_Complement_1
        toPDF.Adresse_Livraison_Adresse_Complement_2 = devis.Adresse_Livraison_Adresse_Complement_2
        toPDF.Adresse_Livraison_CP = devis.Adresse_Livraison_CP
        toPDF.Adresse_Livraison_Ville = devis.Adresse_Livraison_Ville
        toPDF.Client = JSON.parse(JSON.stringify(devis.Client))
        // la méthode {...} est utilisée pour si la formule est null avoir un objet et pouvoir définir isAperitif etc.
        toPDF.Formule_Aperitif = {...JSON.parse(JSON.stringify(devis.Formule_Aperitif))} 
        toPDF.Formule_Aperitif.isAperitif = false
        toPDF.Formule_Cocktail = {...JSON.parse(JSON.stringify(devis.Formule_Cocktail))}
        toPDF.Formule_Cocktail.isCocktail = false
        toPDF.Formule_Box = {...JSON.parse(JSON.stringify(devis.Formule_Box))}
        toPDF.Formule_Box.isBox = false
        toPDF.Formule_Brunch = {...JSON.parse(JSON.stringify(devis.Formule_Brunch))}
        toPDF.Formule_Brunch.isBrunch = false
        toPDF.Commentaire = devis.Commentaire
        toPDF.Liste_Options = []
        toPDF.Remise = devis.Remise
        toPDF.Prix_HT = devis.Prix_HT
        toPDF.Prix_TTC = devis.Prix_TTC
        
        
        if(devis.Id_Formule_Aperitif !== null) {
            toPDF.Formule_Aperitif.isAperitif = true

            const tab_Id_Recettes_Salees = toPDF.Formule_Aperitif.Liste_Id_Recettes_Salees.split(';')
            // création de la liste contenant les noms des recettes salées
            toPDF.Formule_Aperitif.Liste_Recettes_Salees = []
            for(let id of tab_Id_Recettes_Salees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Aperitif.Liste_Recettes_Salees.push(recette.Nom)
            }

            const tab_Id_Recettes_Boissons = toPDF.Formule_Aperitif.Liste_Id_Recettes_Boissons.split(';')
            // création de la liste contenant les noms des boissons
            toPDF.Formule_Aperitif.Liste_Recettes_Boissons = []
            for(let id of tab_Id_Recettes_Boissons) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Aperitif.Liste_Recettes_Boissons.push(recette.Nom)
            }
        }
        if(devis.Id_Formule_Cocktail !== null) {
            toPDF.Formule_Cocktail.isCocktail = true

            const tab_Id_Recettes_Salees = toPDF.Formule_Cocktail.Liste_Id_Recettes_Salees.split(';')
            // création de la liste contenant les noms des recettes salées
            toPDF.Formule_Cocktail.Liste_Recettes_Salees = []
            for(let id of tab_Id_Recettes_Salees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Cocktail.Liste_Recettes_Salees.push(recette.Nom)
            }

            const tab_Id_Recettes_Sucrees = toPDF.Formule_Cocktail.Liste_Id_Recettes_Sucrees.split(';')
            // création de la liste contenant les noms des recettes sucrées
            toPDF.Formule_Cocktail.Liste_Recettes_Sucrees = []
            for(let id of tab_Id_Recettes_Sucrees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Cocktail.Liste_Recettes_Sucrees.push(recette.Nom)
            }

            const tab_Id_Recettes_Boissons = toPDF.Formule_Cocktail.Liste_Id_Recettes_Boissons.split(';')
            // création de la liste contenant les noms des recettes boissons
            toPDF.Formule_Cocktail.Liste_Recettes_Boissons = []
            for(let id of tab_Id_Recettes_Boissons) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Cocktail.Liste_Recettes_Boissons.push(recette.Nom)
            }
        }
        if(devis.Id_Formule_Box !== null) {
            toPDF.Formule_Box.isBox = true

            const tab_Id_Recettes_Salees = toPDF.Formule_Box.Liste_Id_Recettes_Salees.split(';')
            // création de la liste contenant les noms des recettes salées
            toPDF.Formule_Box.Liste_Recettes_Salees = []
            for(let id of tab_Id_Recettes_Salees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Box.Liste_Recettes_Salees.push(recette.Nom)
            }

            const tab_Id_Recettes_Sucrees = toPDF.Formule_Box.Liste_Id_Recettes_Sucrees.split(';')
            // création de la liste contenant les noms des recettes sucrées
            toPDF.Formule_Box.Liste_Recettes_Sucrees = []
            for(let id of tab_Id_Recettes_Sucrees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Box.Liste_Recettes_Sucrees.push(recette.Nom)
            }

            const tab_Id_Recettes_Boissons = toPDF.Formule_Box.Liste_Id_Recettes_Boissons.split(';')
            // création de la liste contenant les noms des recettes boissons
            toPDF.Formule_Box.Liste_Recettes_Boissons = []
            for(let id of tab_Id_Recettes_Boissons) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Box.Liste_Recettes_Boissons.push(recette.Nom)
            }
        }
        if(devis.Id_Formule_Brunch !== null) {
            toPDF.Formule_Brunch.isBrunch = true

            const tab_Id_Recettes_Salees = toPDF.Formule_Brunch.Liste_Id_Recettes_Salees.split(';')
            // création de la liste contenant les noms des recettes salées
            toPDF.Formule_Brunch.Liste_Recettes_Salees = []
            for(let id of tab_Id_Recettes_Salees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Brunch.Liste_Recettes_Salees.push(recette.Nom)
            }

            const tab_Id_Recettes_Sucrees = toPDF.Formule_Brunch.Liste_Id_Recettes_Sucrees.split(';')
            // création de la liste contenant les noms des recettes sucrées
            toPDF.Formule_Brunch.Liste_Recettes_Sucrees = []
            for(let id of tab_Id_Recettes_Sucrees) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Brunch.Liste_Recettes_Sucrees.push(recette.Nom)
            }

            const tab_Id_Recettes_Boissons = toPDF.Formule_Brunch.Liste_Id_Recettes_Boissons.split(';')
            // création de la liste contenant les noms des recettes boissons
            toPDF.Formule_Brunch.Liste_Recettes_Boissons = []
            for(let id of tab_Id_Recettes_Boissons) {
                if(id === '') continue
                const recette = await Recettes.findOne({
                    where : {
                        Id_Recette : id
                    }
                })
                if(recette !== null) toPDF.Formule_Brunch.Liste_Recettes_Boissons.push(recette.Nom)
            }
        }

        // récupérer liste options avec nom et prix
        if(devis.Liste_Options !== null && devis.Liste_Options !== '') {
            const tabOptions = devis.Liste_Options.split(';')
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

        createPDF(res, toPDF)

        // changer statut devis à envvoyé
        devis.Client.Dernier_Statut = 'Devis envoyé'
        devis.Statut = 'Envoyé'
        
        await devis.save()
        await devis.Client.save()
    }
    catch(error) {
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.send(infos.error)
    }
})
// valide un devis pour créer une facture
.post('/devis/validation/:Id_Devis', async (req, res) => {
    const postIdDevis = req.params.Id_Devis  
    let infos = undefined
    let facture = undefined

    try {
        if(postIdDevis !== undefined) {
            // vérifie que le devis est valide
            const devis = await validate(postIdDevis)

            if(devis !== null) {
                facture = await createFacture(devis)
            }

            if(facture !== null) {
                // on met à jour le devis
                devis.Statut = 'Validé'
                await devis.save()

                devis.Client.Dernier_Statut = 'Devis validé'
                await devis.Client.save()

                // on prévient l'utilisateur
                infos = clientInformationObject(undefined, `La facture ${facture.Numero_Facture} pour l'évènement du ${moment(facture.Date_Evenement).format(formatDateHeure)} vient d'être créée.`)
            }
            else {
                throw 'Une erreur est survenue lors de la création de la facture, veuillez recommencer ultérieurement'
            }
        }
        else {
            throw 'Le devis est inconnu.'
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
// modifie un devis
.patch('/devis/:Id_Devis', async (req, res) => {
    let postIdDevis = req.params.Id_Devis
    const body = req.body
    body.isCreation = (body.isCreation == 'true')

    let infos = undefined
    let devis = undefined

    try {
        // on crée d'abord notre devis sans estimation
        if((postIdDevis === undefined || postIdDevis === 'undefined') && body.isCreation) {
            try {
                // on passe une copie du body pour ne pas qu'il soit modifié
                devis = await createDevis({...body})
                if(devis !== undefined) {
                    // on modifie postIdDevis pour pouvoir faire le traitement dans le cas normal ensuite
                    postIdDevis = devis.Id_Devis
                }
                else {
                    devis = null
                }
            }
            catch(error) {
                if(devis !== null && devis !== undefined) {
                    devis.destroy()
                }
                throw error
            }
        }

        // cas classique
        if(postIdDevis !== undefined && postIdDevis !== 'undefined') {
            devis = await Devis.findOne({
                where : {
                    Id_Devis : postIdDevis
                },
                include : {
                    all : true,
                    nested : true
                }
            })
        }
        else {
            throw 'Une erreur s\'est produite, veuillez réessayer plus tard'
        }

        if(devis !== null) {
            // vérification qu'une facture ne soit pas déjà émise pour ce devis
            const factureExistante = await Factures.findOne({
                where : {
                    Id_Devis : devis.Id_Devis,
                    Statut : {
                        [Op.notLike] : 'Annulée'
                    }
                }
            })

            if(factureExistante !== null) {
                throw `La facture ${factureExistante.Numero_Facture} correspond déjà à ce devis. Pour tout de même modifier le devis, celle-ci doit être annulée manuellement.`
            }

            // vérification des formules
            let Formule_Aperitif = null
            let Formule_Cocktail = null
            let Formule_Box = null
            let Formule_Brunch = null

            if(body.Formule_Aperitif.isAperitif) {
                // on vérifie que nos listes se terminent par un ';'
                if(body.Formule_Aperitif.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Aperitif.Liste_Id_Recettes_Salees[body.Formule_Aperitif.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                    body.Formule_Aperitif.Liste_Id_Recettes_Salees += ';'
                }
                if(body.Formule_Aperitif.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Aperitif.Liste_Id_Recettes_Boissons[body.Formule_Aperitif.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                    body.Formule_Aperitif.Liste_Id_Recettes_Boissons += ';'
                }

                // vérification d'une modification de la formule
                if(devis.Formule_Aperitif === null || devis.Formule_Aperitif.Nb_Convives != body.Formule_Aperitif.Nb_Convives ||
                    devis.Formule_Aperitif.Nb_Pieces_Salees != body.Formule_Aperitif.Nb_Pieces_Salees ||
                    devis.Formule_Aperitif.Liste_Id_Recettes_Salees !== body.Formule_Aperitif.Liste_Id_Recettes_Salees ||
                    devis.Formule_Aperitif.Liste_Id_Recettes_Boissons !== body.Formule_Aperitif.Liste_Id_Recettes_Boissons) 
                {
                    const formule = await modifyFormule(devis.Formule_Aperitif, body.Formule_Aperitif)
                    if(formule !== undefined) {
                        Formule_Aperitif = formule
                    }
                }
                // s'il n'y avait pas de formule Aperitif ou s'il n'y a pas de différence, on récupère la formule existante
                else {
                    Formule_Aperitif = devis.Formule_Aperitif
                }
            }
            if(body.Formule_Cocktail.isCocktail) {
                // on vérifie que nos listes se terminent par un ';'
                if(body.Formule_Cocktail.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Salees[body.Formule_Cocktail.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                    body.Formule_Cocktail.Liste_Id_Recettes_Salees += ';'
                }
                if(body.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Sucrees[body.Formule_Cocktail.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                    body.Formule_Cocktail.Liste_Id_Recettes_Sucrees += ';'
                }
                if(body.Formule_Cocktail.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Cocktail.Liste_Id_Recettes_Boissons[body.Formule_Cocktail.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                    body.Formule_Cocktail.Liste_Id_Recettes_Boissons += ';'
                }

                // vérification d'une modification de la formule
                if(devis.Formule_Cocktail === null || devis.Formule_Cocktail.Nb_Convives != body.Formule_Cocktail.Nb_Convives ||
                    devis.Formule_Cocktail.Nb_Pieces_Salees != body.Formule_Cocktail.Nb_Pieces_Salees ||
                    devis.Formule_Cocktail.Nb_Pieces_Sucrees != body.Formule_Cocktail.Nb_Pieces_Sucrees ||
                    devis.Formule_Cocktail.Liste_Id_Recettes_Salees !== body.Formule_Cocktail.Liste_Id_Recettes_Salees ||
                    devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees !== body.Formule_Cocktail.Liste_Id_Recettes_Sucrees ||
                    devis.Formule_Cocktail.Liste_Id_Recettes_Boissons !== body.Formule_Cocktail.Liste_Id_Recettes_Boissons) 
                {
                    const formule = await modifyFormule(devis.Formule_Cocktail, body.Formule_Cocktail)
                    if(formule !== undefined) {
                        Formule_Cocktail = formule
                    }
                }
                // s'il n'y avait pas de formule Cocktail ou s'il n'y a pas de différence, on récupère la formule existante
                else {
                    Formule_Cocktail = devis.Formule_Cocktail
                }
            }
            if(body.Formule_Box.isBox) {
                if(body.Formule_Box.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Box.Liste_Id_Recettes_Salees[body.Formule_Box.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                    body.Formule_Box.Liste_Id_Recettes_Salees += ';'
                }
                if(body.Formule_Box.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Box.Liste_Id_Recettes_Sucrees[body.Formule_Box.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                    body.Formule_Box.Liste_Id_Recettes_Sucrees += ';'
                }
                if(body.Formule_Box.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Box.Liste_Id_Recettes_Boissons[body.Formule_Box.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                    body.Formule_Box.Liste_Id_Recettes_Boissons += ';'
                }

                // vérification d'une modification de la formule
                if(devis.Formule_Box === null || devis.Formule_Box.Nb_Convives != body.Formule_Box.Nb_Convives ||
                    devis.Formule_Box.Liste_Id_Recettes_Salees !== body.Formule_Box.Liste_Id_Recettes_Salees ||
                    devis.Formule_Box.Liste_Id_Recettes_Sucrees !== body.Formule_Box.Liste_Id_Recettes_Sucrees ||
                    devis.Formule_Box.Liste_Id_Recettes_Boissons !== body.Formule_Box.Liste_Id_Recettes_Boissons) 
                {
                    const formule = await modifyFormule(devis.Formule_Box, body.Formule_Box)
                    if(formule !== undefined) {
                        Formule_Box = formule
                    }
                }
                // s'il n'y avait pas de formule Box ou s'il n'y a pas de différence, on récupère la formule existante
                else {
                    Formule_Box = devis.Formule_Box
                }
            }
            if(body.Formule_Brunch.isBrunch) {
                if(body.Formule_Brunch.Liste_Id_Recettes_Salees.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Salees[body.Formule_Brunch.Liste_Id_Recettes_Salees.length - 1] !== ';') {
                    body.Formule_Brunch.Liste_Id_Recettes_Salees += ';'
                }
                if(body.Formule_Brunch.Liste_Id_Recettes_Sucrees.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Sucrees[body.Formule_Brunch.Liste_Id_Recettes_Sucrees.length - 1] !== ';') {
                    body.Formule_Brunch.Liste_Id_Recettes_Sucrees += ';'
                }
                if(body.Formule_Brunch.Liste_Id_Recettes_Boissons.length > 1 && body.Formule_Brunch.Liste_Id_Recettes_Boissons[body.Formule_Brunch.Liste_Id_Recettes_Boissons.length - 1] !== ';') {
                    body.Formule_Brunch.Liste_Id_Recettes_Boissons += ';'
                }

                // vérification d'une modification de la formule
                if(devis.Formule_Brunch === null || devis.Formule_Brunch.Nb_Convives != body.Formule_Brunch.Nb_Convives ||
                    devis.Formule_Brunch.Nb_Pieces_Salees != body.Formule_Brunch.Nb_Pieces_Salees ||
                    devis.Formule_Brunch.Nb_Pieces_Sucrees != body.Formule_Brunch.Nb_Pieces_Sucrees ||
                    devis.Formule_Brunch.Liste_Id_Recettes_Salees !== body.Formule_Brunch.Liste_Id_Recettes_Salees ||
                    devis.Formule_Brunch.Liste_Id_Recettes_Sucrees !== body.Formule_Brunch.Liste_Id_Recettes_Sucrees ||
                    devis.Formule_Brunch.Liste_Id_Recettes_Boissons !== body.Formule_Brunch.Liste_Id_Recettes_Boissons) 
                {
                    // on initialise les valeurs par défaut si le type de brunch n'est pas sélectionné
                    if(!body.Formule_Brunch.isBrunchSale) body.Formule_Brunch.Nb_Pieces_Salees = tableCorrespondanceTypes['Brunch'].nbPieces['salées'].min
                    if(!body.Formule_Brunch.isBrunchSucre) body.Formule_Brunch.Nb_Pieces_Sucrees = tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].min

                    const formule = await modifyFormule(devis.Formule_Brunch, body.Formule_Brunch)
                    if(formule !== undefined) {
                        Formule_Brunch = formule
                    }
                }
                // s'il n'y avait pas de formule Brunch ou s'il n'y a pas de différence, on récupère la formule existante
                else {
                    Formule_Brunch = devis.Formule_Brunch
                }
            }

            // vérification des options
            if(devis.Liste_Options !== body.Liste_Options) {
                body.Liste_Options = await checksListeOptions(body.Liste_Options)
            }

            // vérifiacation de la remise
            if(body.Remise !== null) {
                body.Remise = await createOrLoadRemise(body.Remise)
            }
            else {
                body.Remise = {
                    Id_Remise : null,
                    IsPourcent : false,
                    Valeur : 0
                }
            }

            // gestion des prix
            let prixHT = 0
            let prixTTC = 0

            if(Formule_Aperitif !== null) {
                prixHT += Formule_Aperitif.Prix_HT
            }
            if(Formule_Cocktail !== null) {
                prixHT += Formule_Cocktail.Prix_HT
            }
            if(Formule_Box !== null) {
                prixHT += Formule_Box.Prix_HT
            }
            if(Formule_Brunch !== null) {
                prixHT += Formule_Brunch.Prix_HT
            }

            // options
            if(!(body.Liste_Options === null || body.Liste_Options === '')) {
                const tabOptions = body.Liste_Options.split(';')
                for(let id of tabOptions) {
                    if(id === '') continue
                    const option = await Prix_Unitaire.findOne({
                        where : {
                            Id_Prix_Unitaire : Number(id)
                        }
                    })
                    if(option !== null) prixHT += option.Montant
                }
            }

            // remise
            if(body.Remise.IsPourcent) {
                prixHT -= prixHT * (body.Remise.Valeur / 100)
            }
            else {
                prixHT -= body.Remise.Valeur
            }

            if(prixHT < 0) {
                throw 'Le prix ne peut pas être négatif.'
            }

            prixTTC = prixHT * 1.1

            if(!isSet(body.client.Adresse_Facturation_Adresse) || !isSet(body.client.Adresse_Facturation_CP) || !isSet(body.client.Adresse_Facturation_Ville)) {
                throw "L'adresse de facturation doit être renseignée."
            }
            else {
                body.client.Adresse_Facturation_Adresse_Complement_1 = isSet(body.client.Adresse_Facturation_Adresse_Complement_1) ? body.client.Adresse_Facturation_Adresse_Complement_1 : ''
                body.client.Adresse_Facturation_Adresse_Complement_2 = isSet(body.client.Adresse_Facturation_Adresse_Complement_2) ? body.client.Adresse_Facturation_Adresse_Complement_2 : ''
            }

            if(!isSet(body.Adresse_Livraison_Adresse) || !isSet(body.Adresse_Livraison_CP) || !isSet(body.Adresse_Livraison_Ville)) {
                throw "L'adresse de livraison doit être renseignée."
            }
            else {
                body.Adresse_Livraison_Adresse_Complement_1 = isSet(body.Adresse_Livraison_Adresse_Complement_1) ? body.Adresse_Livraison_Adresse_Complement_1 : ''
                body.Adresse_Livraison_Adresse_Complement_2 = isSet(body.Adresse_Livraison_Adresse_Complement_2) ? body.Adresse_Livraison_Adresse_Complement_2 : ''
            }


            // màj des infos client
            await updateClient(devis.Id_Client, body.client)

            devis.Date_Evenement = moment.utc(body.Date_Evenement)
            devis.Adresse_Livraison_Adresse = body.Adresse_Livraison_Adresse
            devis.Adresse_Livraison_Adresse_Complement_1 = body.Adresse_Livraison_Adresse_Complement_1
            devis.Adresse_Livraison_Adresse_Complement_2 = body.Adresse_Livraison_Adresse_Complement_2
            devis.Adresse_Livraison_CP = body.Adresse_Livraison_CP
            devis.Adresse_Livraison_Ville = body.Adresse_Livraison_Ville
            devis.Commentaire = body.Commentaire
            devis.Liste_Options = body.Liste_Options
            devis.Id_Remise = body.Remise.Id_Remise
            devis.Id_Formule_Aperitif = Formule_Aperitif !== null ? Formule_Aperitif.Id_Formule : null
            devis.Id_Formule_Cocktail = Formule_Cocktail !== null ? Formule_Cocktail.Id_Formule : null
            devis.Id_Formule_Box = Formule_Box !== null ? Formule_Box.Id_Formule : null
            devis.Id_Formule_Brunch = Formule_Brunch !== null ? Formule_Brunch.Id_Formule : null
            devis.Prix_HT = Number.parseFloat(prixHT).toFixed(2)
            devis.Prix_TTC = Number.parseFloat(prixTTC).toFixed(2)


            await devis.save()
            
            let message = ''
            
            if(body.isCreation) {
                message = 'Le devis a bien été créé.'
            }
            else {
                message = 'Le devis a bien été modifié.'
            }
            infos = clientInformationObject(undefined, message)
        }
        else {
            throw 'Le devis n\'existe pas.'
        }
        
    }
    catch(error) {
        devis = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        devis
    })
})
// archive un devis
.patch('/devis/archive/:Id_Devis', async (req, res) => {
    const postIdDevis = req.params.Id_Devis
    let infos = undefined
    let devis = undefined

    try {
        devis = await Devis.findOne({
            where : {
                Id_Devis : postIdDevis
            }
        })

        if(devis !== null) {
            devis.Statut = 'Archivé'
            await devis.save()

            await Clients.update(
                {
                    Dernier_Statut : 'Devis archivé'
                },
                {
                    where : {
                        Id_Client : devis.Id_Client
                    }
                }
            )

            infos = clientInformationObject(undefined, 'Le devis a bien été archivé')
        }
        else {
            throw 'Le devis n\'existe pas'
        }
    }
    catch(error) {
        devis = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        devis
    })
})

module.exports = {
    router,
    createDevis,
    getListInfosDevis,
    validate
}
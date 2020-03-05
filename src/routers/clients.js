const express = require('express')
const router = new express.Router()
const { Clients } = global.db
const errorHandler = require('../utils/errorHandler')

router
// création d'un client
.post('/clients', async (req, res) => {
    // récupération des données client
    const postClient = req.query

    // init valeurs retour
    let infos = undefined
    let client = undefined

   try {
        // crée un nouveau client où le récupère s'il existe déjà
        const [ temp_client, created ] = await Clients.findOrCreate({
            where : {
                Email : postClient.Email
            },
            defaults : {
                Nom_Prenom : postClient.Nom_Prenom,
                Adresse_Facturation : postClient.Adresse_Facturation,
                Telephone : postClient.Telephone,
                Type : postClient.Type
            }
        })
        // récupération de l'objet client
        client = temp_client.dataValues 

        // modifie le client s'il existe déjà et ses informations sont différentes
        if(!created && (
            postClient.Nom_Prenom !== client.Nom_Prenom || 
            postClient.Adresse_Facturation !== client.Adresse_Facturation ||
            postClient.Telephone !== client.Telephone ||
            postClient.Type !== client.Type
            )) {
            // update renvoie le nombre de lignes modifiées
            await Clients.update(
                {
                    Nom_Prenom : postClient.Nom_Prenom,
                    Adresse_Facturation : postClient.Adresse_Facturation,
                    Telephone : postClient.Telephone,
                    Type : postClient.Type
                },
                {
                    where : {
                        Email : postClient.Email
                    }
                }
            )
            // on affecte à client les valeurs du post qui ont été mises en BDD plutôt que de relancer une requête
            client.Nom_Prenom = postClient.Nom_Prenom
            client.Adresse_Facturation = postClient.Adresse_Facturation
            client.Telephone = postClient.Telephone
            client.Email = postClient.Email
            client.Type = postClient.Type
        }
   }
   catch(error) {
       infos = errorHandler(error.errors[0].message, undefined)
   }

   // la création d'un client se fait automatiquement depuis une estimation
   // on n'affiche donc pas de vue ensuite
   res.send({
       infos,
       client
   })
})
// tableau clients
.get('/clients', async (req, res) => {  
    let infos = undefined

    const clients = await Clients.findAll()
    if(clients === null) {
        infos = errorHandler('Une erreur s\'est produite, impossible de charger les clients.', undefined)
    }
    else if(clients.length === 0) {
        infos = errorHandler(undefined, 'Il n\'y a aucun client.')
    }

    res.render('index', {
        isClients : true,
        infos,
        clients
    })
})
// client spécifique
.get('/clients/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getClient = req.params
    
    // init valeurs retour
    let infos = undefined
    let client = undefined

    // on vérifie les informations passées pour que l'Id_Client existe
    if(getClient.Id_Client && getClient.Id_Client !== '') {
        client = await Clients.findOne({
            where : {
                Id_Client : getClient.Id_Client
            }
        })
    }
    else {
        infos = errorHandler('L\'identifiant du client est invalide.', undefined)
        client = undefined
    }

    // aucun client trouvé
    if(client === null) {
        infos = errorHandler('Le client n\'existe pas.', undefined)
        client = undefined
    }

    res.send({
        infos,
        client
    })
})
// modifie client
// utiliser method POST au lieu de PATCh car envoi depuis un formulaire html
.post('/clients/patch/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getId_Client = req.params.Id_Client
    // récupération des données client
    const postClient = req.query

    // init valeurs retour
    let infos = undefined
    let client = undefined
    let afficheClient = false

    try {
        const temp_client = await Clients.findOne({
            where : {
                Id_Client : getId_Client
            }
        })

        if(temp_client !== null) {
            // récupération de l'objet client
            client = temp_client.dataValues
            
            client.Nom_Prenom = postClient.Nom_Prenom || client.Nom_Prenom
            client.Adresse_Facturation = postClient.Adresse_Facturation || client.Adresse_Facturation
            client.Email = postClient.Email || client.Email
            client.Telephone = postClient.Telephone || client.Telephone
            client.Type = postClient.Type || client.Type

            await Clients.update(
                {
                    Nom_Prenom : client.Nom_Prenom,
                    Adresse_Facturation : client.Adresse_Facturation,
                    Email : client.Email,
                    Telephone : client.Telephone,
                    Type : client.Type
                },
                {
                    where : {
                        Id_Client : client.Id_Client
                    }
                }
            )
            infos = errorHandler(undefined, 'Le client a bien été modifié.')
        }
        else {
            infos = errorHandler('Le client n\'existe pas.')
            afficheClient = true
        }
    }
    catch(error) {
        infos = errorHandler(error.errors[0].message, undefined)
        afficheClient = true
    }

    // on renvoie sur le tableau client si tout s'est bien passé et on affiche que tout s'est bien déroulé
    // ou on affiche la modale avec l'erreur associée
    res.render('index', {
        isClients : true,
        infos,
        client,
        afficheClient
    })
    
})
// supprime clinet
// utiliser method POST au lieu de DELETE car envoi depuis un formulaire html
.post('/clients/delete/:Id_Client', (req, res) => {

})


module.exports = router
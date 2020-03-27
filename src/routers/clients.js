const express = require('express')
const router = new express.Router()
const { Clients } = global.db
const errorHandler = require('../utils/errorHandler')

const createOrLoadClient = async (postClient) => {
    // init valeurs retour
    // let infos = undefined
    let client = undefined

    // vérification car impossible de faire un WHERE avec "undefined"
    postClient.Email = postClient.Email === undefined ? '' : postClient.Email.trim()
    // vérification car impossible d'appeler trim() sur undefined
    postClient.Nom_Prenom = postClient.Nom_Prenom === undefined ? '' : postClient.Nom_Prenom.trim()
    postClient.Telephone = postClient.Telephone === undefined ? '' : postClient.Telephone.trim().replace(/ /g, '') // retire également les espaces inutils

    try {
        // crée un nouveau client où le récupère s'il existe déjà
        const [ temp_client, created ] = await Clients.findOrCreate({
            where : {
                Email : postClient.Email
            },
            defaults : {
                Nom_Prenom : postClient.Nom_Prenom,
                Telephone : postClient.Telephone
            }
        })
        // récupération de l'objet client
        client = temp_client.dataValues 

        // modifie le client s'il existe déjà et ses informations sont différentes
        if(!created && (
            postClient.Nom_Prenom !== client.Nom_Prenom || 
            postClient.Telephone !== client.Telephone ||
            postClient.Type !== client.Type
            )) {
            // update renvoie le nombre de lignes modifiées
            await Clients.update(
                {
                    Nom_Prenom : postClient.Nom_Prenom,
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
            client.Telephone = postClient.Telephone
            client.Email = postClient.Email
        }
   }
   catch(error) {
    //    infos = errorHandler(error.errors[0].message, undefined)
    throw new Error(error.errors[0].message)
   }

//    return {
//        infos,
//        client
//    }
   return client
}

router
// création d'un client
.post('/clients', async (req, res) => {
    // récupération des données client
    const postClient = req.query   
    let infos = undefined 
    let client = undefined

    // const {infos, client} = await createOrLoadClient(postClient)
    try {
        client = await createOrLoadClient(postClient)
    }
    catch(error) {
        infos = errorHandler(error, undefined)
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
        infos = errorHandler(undefined, 'Aucun client')
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
.patch('/clients/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getId_Client = req.params.Id_Client
    // récupération des données client
    const postClient = req.query

    // init valeurs retour
    let infos = undefined
    let client = undefined

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
                    Telephone : client.Telephone.trim(),
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
        }
    }
    catch(error) {
        infos = errorHandler(error.errors[0].message, undefined)
    }

    res.send({
        infos,
        client
    })
    
})
// supprime client
// utiliser method POST au lieu de DELETE car envoi depuis un formulaire html
// .post('/clients/delete/:Id_Client', async (req, res) => {
.delete('/clients/delete/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getId_Client = req.params.Id_Client

    // init valeurs retour
    let infos = undefined

    try {
        await Clients.destroy({
            where : {
                Id_Client : getId_Client
            }
        })
        infos = errorHandler(undefined, 'Le client a bien été supprimé')
    }
    catch(error) {
        infos = errorHandler('Le client n\'existe pas.', undefined)
    }

    res.send({
        infos
    })
})


module.exports = {
    router,
    createOrLoadClient
}
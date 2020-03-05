const express = require('express')
const router = new express.Router()
const { Clients } = global.db
const errorHandler = require('../utils/errorHandler')

router
// création d'un client
.post('/clients', async (req, res) => {
    // éléments pour la création du client (ex : nom, prénom etc)
    const tempClient = req.body
    /*
    * ici sauvegarde bd + récupération du client
    */
   try {
        const client = await Clients.create({
            Nom_Prenom : 'client TEST',
            Adresse_Facturation : 'adresse TEST',
            Email : 'test@mail.com',
            Telephone : '0102030405',
            Type : 'test'
        })

        res.render('index', {
            isClients : true,
            client
        })
   }
   catch(error) {
       res.render('index', {
           isClient : true,
           infos : errorHandler(error, undefined)
       })
   }
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
.get('/clients/:id', (req, res) => {
    idClient = req.params.id
    fakeClient.id = idClient
    res.render('client', {
        titrePage: `Client n° ${idClient}`,
        client: fakeClient.toString()
    })
})
// modifie client
.patch('clients/:id', (req, res) => {
    idClient = req.params.id
    /*
    * ici sauvegarde bd + récupération du client
    */
    fakeClient.id = idClient
    res.render('client', {
        titrePage: `Client n° ${idClient} mis à jour`,
        client: fakeClient
    })
})
// supprime clinet
.delete('clients/:id', (req, res) => {
    idClient = req.params.id
    /*
    * ici sauvegarde bd + récupération du client
    */
    fakeClient.id = idClient
    res.render('client', {
        titrePage: `Client n° ${idClient} supprimé`,
        client: fakeClient
    })
})


module.exports = router
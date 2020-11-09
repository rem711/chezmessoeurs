const express = require('express')
const { Op } = require('sequelize')
const router = new express.Router()
const { Clients, Ventes, Factures } = global.db
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')

const createOrLoadClient = async (postClient) => {
    let client = undefined

    // vérification des données
    if(postClient.Nom === undefined || postClient.Nom === 'undefined' || postClient.Nom === '') {
        throw "Le nom doit être défini."
    }
    if(postClient.Prenom === undefined || postClient.Prenom === 'undefined' || postClient.Prenom === '') {
        throw "Le prénom doit être défini."
    }
    if(postClient.Email === undefined || postClient.Email === 'undefined' || postClient.Email === '') {
        throw "L'adresse e-mail doit être définie."
    }
    else if(postClient.Email.match(/^.+@.+\.[a-z][a-z]+$/ig) === null) {
        throw "L'adresse e-mail est incorrecte."
    }
    if(postClient.Telephone === undefined || postClient.Telephone === 'undefined' || postClient.Telephone === '') {
        throw "Le numéro de téléphone doit être défini."
    }
    else {
        postClient.Telephone = postClient.Telephone.replace(/ /g, '').replace(/-/g, '').replace(/_/g, '').replace(/\./g, '')
        if(postClient.Telephone.match(/^[0-9]{10}$/g) === null) {
            throw "Le numéro de téléphone est incorrect."
        }
    }

    // postClient.Type = postClient.Type === undefined ? 'Particulier' : postClient.Type

    // crée un nouveau client où le récupère s'il existe déjà
    const [temp_client, created] = await Clients.findOrCreate({
        where : {
            Email : postClient.Email
        },
        defaults : {
            Nom : postClient.Nom,
            Prenom : postClient.Prenom,
            Telephone : postClient.Telephone
        }
    })
    // récupération de l'objet client
    client = temp_client

    // modifie le client s'il existe déjà et ses informations sont différentes
    if(!created && (
        postClient.Nom !== client.Nom || 
        postClient.Prenom !== client.Prenom || 
        postClient.Telephone !== client.Telephone
        )) {
        // on affecte à client les valeurs du post qui ont été mises en BDD plutôt que de relancer une requête
        client.Nom = postClient.Nom
        client.Prenom = postClient.Prenom
        client.Telephone = postClient.Telephone

        await client.save()
    }

    return client
}

const updateClient = async (Id_Client, postClient) => {
    let client = undefined

    // vérification des données
    if(postClient.Nom === undefined || postClient.Nom === 'undefined' || postClient.Nom === '') {
        throw "Le nom doit être défini."
    }
    if(postClient.Prenom === undefined || postClient.Prenom === 'undefined' || postClient.Prenom === '') {
        throw "Le prénom doit être défini."
    }
    if(postClient.Adresse_Facturation_Adresse === undefined || postClient.Adresse_Facturation_Adresse === 'undefined' || postClient.Adresse_Facturation_Adresse === '') {
        throw "L'adresse de facturation doit être définie."
    }
    if(postClient.Adresse_Facturation_CP === undefined || postClient.Adresse_Facturation_CP === 'undefined' || postClient.Adresse_Facturation_CP === '') {
        throw "Le code postal doit être défini."
    }
    else if(postClient.Adresse_Facturation_CP.match(/[0-9]{5}/g) === null) {
        throw "Le format du code postal est incorrect."
    }
    if(postClient.Adresse_Facturation_Ville === undefined || postClient.Adresse_Facturation_Ville === 'undefined' || postClient.Adresse_Facturation_Ville === '') {
        throw "La ville doit être définie."
    }
    if(postClient.Email === undefined || postClient.Email === 'undefined' || postClient.Email === '') {
        throw "L'adresse e-mail doit être définie."
    }
    else if(postClient.Email.match(/^.+@.+\.[a-z][a-z]+$/ig) === null) {
        throw "L'adresse e-mail est incorrecte."
    }
    if(postClient.Telephone === undefined || postClient.Telephone === 'undefined' || postClient.Telephone === '') {
        throw "Le numéro de téléphone doit être défini."
    }
    else {
        postClient.Telephone = postClient.Telephone.replace(/ /g, '').replace(/-/g, '').replace(/_/g, '').replace(/\./g, '')
        if(postClient.Telephone.match(/^[0-9]{10}$/g) === null) {
            throw "Le numéro de téléphone est incorrect."
        }
    }
    if(postClient.Type === undefined || postClient.Type === 'undefined' || postClient.Type === '') {
        throw "Le type doit être défini."
    }
    if(postClient.Type === 'Professionnel') {
        if(postClient.Societe === undefined || postClient.Societe === 'undefined' || postClient.Societe === '') {
            throw "Le nom de la société doit être défini."
        }
        // if(postClient.Numero_TVA === undefined || postClient.Numero_TVA === 'undefined' || postClient.Numero_TVA === '') {
        //     throw "Le numéro de TVA doit être défini."
        // }
        if(postClient.Numero_TVA !== undefined && postClient.Numero_TVA !== 'undefined' && postClient.Numero_TVA === '' && postClient.Numero_TVA !== null) {
            postClient.Numero_TVA = postClient.Numero_TVA.toUpperCase()
            if(postClient.Numero_TVA.match(/^FR[0-9]{2}[0-9]{9}$/ig) === null) {
                throw "Le format du numéro de TVA est incorrect."
            }
        }
    }
    else {
        postClient.Societe = null
        postClient.Numero_TVA = null
    }

    if(postClient.Adresse_Facturation_Adresse_Complement_1 === undefined || postClient.Adresse_Facturation_Adresse_Complement_1 === 'undefined') {
        postClient.Adresse_Facturation_Adresse_Complement_1 = ''
    }
    if(postClient.Adresse_Facturation_Adresse_Complement_2 === undefined || postClient.Adresse_Facturation_Adresse_Complement_2 === 'undefined') {
        postClient.Adresse_Facturation_Adresse_Complement_2 = ''
    }

    client = await Clients.findOne({
        where : {
            Id_Client
        }
    })

    if(client === null) {
        throw "Le client demandé n'existe pas."
    }

    client.Nom = postClient.Nom
    client.Prenom = postClient.Prenom
    client.Societe = postClient.Societe
    client.Adresse_Facturation_Adresse = postClient.Adresse_Facturation_Adresse
    client.Adresse_Facturation_Adresse_Complement_1 = postClient.Adresse_Facturation_Adresse_Complement_1
    client.Adresse_Facturation_Adresse_Complement_2 = postClient.Adresse_Facturation_Adresse_Complement_2
    client.Adresse_Facturation_CP = postClient.Adresse_Facturation_CP
    client.Adresse_Facturation_Ville = postClient.Adresse_Facturation_Ville
    client.Numero_TVA = postClient.Numero_TVA
    client.Email = postClient.Email
    client.Telephone = postClient.Telephone
    client.Type = postClient.Type

    await client.save()

    return client
}

router
// création d'un client
.post('/clients', async (req, res) => {
    // récupération des données client
    const postClient = req.body   
    let infos = undefined 
    let client = undefined

    try {
        // vérification des données
        if(postClient.Nom === undefined || postClient.Nom === 'undefined' || postClient.Nom === '') {
            throw "Le nom doit être défini."
        }
        if(postClient.Prenom === undefined || postClient.Prenom === 'undefined' || postClient.Prenom === '') {
            throw "Le prénom doit être défini."
        }
        if(postClient.Email === undefined || postClient.Email === 'undefined' || postClient.Email === '') {
            throw "L'adresse e-mail doit être définie."
        }
        else if(postClient.Email.match(/^.+@.+\.[a-z][a-z]+$/ig) === null) {
            throw "L'adresse e-mail est incorrecte."
        }
        if(postClient.Telephone === undefined || postClient.Telephone === 'undefined' || postClient.Telephone === '') {
            throw "Le numéro de téléphone doit être défini."
        }
        else {
            postClient.Telephone = postClient.Telephone.replace(/ /g, '').replace(/-/g, '').replace(/_/g, '').replace(/\./g, '')
            if(postClient.Telephone.match(/^[0-9]{10}$/g) === null) {
                throw "Le numéro de téléphone est incorrect."
            }
        }

        const temp_client = await Clients.findOne({
            where : {
                Nom : postClient.Nom,
                Prenom : postClient.Prenom,
                Telephone : postClient.Telephone,
                Email : postClient.Email,
                Adresse_Facturation_CP : postClient.Adresse_Facturation_CP,
                Adresse_Facturation_Ville : postClient.Adresse_Facturation_Ville
            }
        })

        if(temp_client) throw "Le client existe déjà."

        client = await Clients.create(postClient)

        infos = clientInformationObject(undefined, "Le client a bien été ajouté.")
    }
    catch(error) {
        client = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
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
    let clients = undefined

    try {
        clients = await Clients.findAll({
            order : [['Societe', 'ASC'], ['Nom', 'ASC'], ['Prenom', 'ASC']]
        })
        if(clients === null) {
            throw 'Une erreur s\'est produite, impossible de charger les clients.'
        }
        else if(clients.length === 0) {
            infos = clientInformationObject(undefined, 'Aucun client.')
        }
    }
    catch(error) {
        clients = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }
    
    res.render('index', {
        isClients : true,
        infos,
        clients
    })
})
// retourne la liste des clients
.get('/clients/liste', async (req, res) => {  
    let infos = undefined
    let clients = undefined

    try {
        clients = await Clients.findAll({
            order : [['Societe', 'ASC'], ['Nom', 'ASC'], ['Prenom', 'ASC']]
        })
        if(clients === null) {
            throw 'Une erreur s\'est produite, impossible de charger les clients.'
        }
        else if(clients.length === 0) {
            infos = clientInformationObject(undefined, 'Aucun client.')
        }
    }
    catch(error) {
        clients = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }
    
    res.send({
        infos, 
        clients
    })
})
// exporte la liste des clients au format csv
.get('/clients/export_clients_*.csv', async (req, res) => {
    try {
        const clients = await Clients.findAll({
            include : { 
                model : Ventes,
                include : {
                    model : Factures,
                    where : {
                        Type_Facture : {
                            [Op.not] : 'avoir'
                        },
                        IsCanceled : 0
                    }
                }
            },
            order : [['Societe', 'ASC'], ['Nom', 'ASC'], ['Prenom', 'ASC']]
        })
        if(clients === null) throw "Une erreur s'est produite lors de la récupération des clients."

        // définition format pour que les accents passent
        let csv = '\uFEFF'
        // définition colonnes
        csv += 'Société;Type;Nom;Prenom;Adresse;Complement 1;Complement 2;CP;Ville;Email;Tél;Numero TVA; Nombre prestations\r\n'

        for(const client of clients) {
            // compte du nombre de ventes du clients qui sont facturées (et dont la facture n'a pas été annulée)
            const nbPrestations = client.Ventes.reduce((accumulator, vente) => vente.Factures.length ? (accumulator + 1) : accumulator, 0)            

            csv += `${client.Societe ? client.Societe : ''};`
            csv += `${client.Type};`
            csv += `${client.Nom};`
            csv += `${client.Prenom};`
            csv += `${client.Adresse_Facturation_Adresse ? client.Adresse_Facturation_Adresse : ''};`
            csv += `${client.Adresse_Facturation_Adresse_Complement_1 ? client.Adresse_Facturation_Adresse_Complement_1 : ''};`
            csv += `${client.Adresse_Facturation_Adresse_Complement_2 ? client.Adresse_Facturation_Adresse_Complement_2 : ''};`
            csv += `${client.Adresse_Facturation_CP ? client.Adresse_Facturation_CP : ''};`
            csv += `${client.Adresse_Facturation_Ville ? client.Adresse_Facturation_Ville : ''};`
            csv += `${client.Email ? client.Email : ''};`
            csv += `${client.Telephone ? client.Telephone : ''};`
            csv += `${client.Numero_TVA ? client.Numero_TVA : ''};`
            csv += nbPrestations

            csv += '\r\n'
        }

        const path = req.path.split('/')
        
        res.header('Content-Type', 'text/csv')
        res.attachment(path[path.length - 1])
        
        res.send(csv)
    }
    catch(error) {
        const infos = clientInformationObject(error)
        res.send(infos.error)
    }
})
// client spécifique
.get('/clients/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getClient = req.params
    
    // init valeurs retour
    let infos = undefined
    let client = undefined

    try {
        // on vérifie les informations passées pour que l'Id_Client existe
        if(getClient.Id_Client && getClient.Id_Client !== '') {
            client = await Clients.findOne({
                where : {
                    Id_Client : getClient.Id_Client
                }
            })
        }
        else {
            client = undefined
            throw 'L\'identifiant du client est invalide.'
        }

        // aucun client trouvé
        if(client === null) {
            client = undefined
            throw 'Le client n\'existe pas.'
        }
    }
    catch(error) {
        client = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
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
    const postClient = req.body

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
            client = await updateClient(temp_client.Id_Client, postClient)

            infos = clientInformationObject(undefined, 'Le client a bien été modifié.')
        }
        else {
            throw 'Le client n\'existe pas.'
        }
    }
    catch(error) {
        client = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos,
        client
    })
    
})
// supprime client
.delete('/clients/:Id_Client', async (req, res) => {
    // récupération de l'Id_Client
    const getId_Client = req.params.Id_Client

    // init valeurs retour
    let infos = undefined

    try {
        const client = await Clients.findOne({
            include : { model : Ventes },
            where : {
                Id_Client : getId_Client
            }
        })
        if(client === null) throw "Le client n'existe pas."
        if(client.Ventes && client.Ventes.length > 0) throw "Le client ne peut pas être supprimé car il possède un historique de ventes."

        await client.destroy()

        infos = clientInformationObject(undefined, "Le client a bien été supprimé.")
    }
    catch(error) {
        client = undefined
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }

    res.send({
        infos
    })
})

module.exports = {
    router,
    createOrLoadClient,
    updateClient
}
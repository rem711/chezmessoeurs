const express = require('express')
const router = new express.Router()
const { Clients } = global.db
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
        if(postClient.Numero_TVA === undefined || postClient.Numero_TVA === 'undefined' || postClient.Numero_TVA === '') {
            throw "Le numéro de TVA doit être défini."
        }
        else {
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
    const postClient = req.query   
    let infos = undefined 
    let client = undefined

    try {
        client = await createOrLoadClient(postClient)
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
        clients = await Clients.findAll()
        if(clients === null) {
            throw 'Une erreur s\'est produite, impossible de charger les clients.'
        }
        else if(clients.length === 0) {
            infos = clientInformationObject(undefined, 'Aucun client')
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

module.exports = {
    router,
    createOrLoadClient,
    updateClient
}
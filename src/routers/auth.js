const express = require('express')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const { Utilisateurs } = global.db
const { clientInformationObject, getErrorMessage } = require('../utils/errorHandler')
const logger = require('../utils/logger')

router
.post('/authentification/login', async (req, res) => {
    const postLogin = req.body.login
    const postPasswd = req.body.password
    let user = undefined

    try {    
        // récupération de l'utilisateur via le login  
        user = await Utilisateurs.findOne({
            where : {
                Login : postLogin
            }
        })

        // login incorrect
        if(user === null) {
            throw "Identifiant ou mot de passe incorrect."
        }

        // vérification du mot de passe
        const isMatch = await bcrypt.compare(postPasswd, user.Password)

        // mot de passe incorrect
        if(!isMatch) {
            throw "Identifiant ou mot de passe incorrect."
        }

        req.session.authenticated = true
        req.session.userId = user.Id_Utilisateur

        logger.info(`${user.Login} s'est connecté`)
        res.redirect('/')
    }
    catch(error) {
        logger.warn(`Une tentative de connexion a eu lieu en utilisant la combinaison : (${postLogin} || ${postPasswd}) depuis l'adresse : ${req.header('x-forwarded-for') || req.connection.remoteAdress}`)
        const infos = clientInformationObject(getErrorMessage(error), undefined)
        res.render('auth', { 
            infos 
        })
    }
})
.get('/authentification/logout', async (req, res) => {
    let infos = undefined
    let user = undefined

    try {
        if(req.session.userId) {
            user = await Utilisateurs.findOne({
                where : {
                    Id_Utilisateur : req.session.userId
                }
            })

            if(user !== null) {
                logger.info(`${user.Login} s'est déconnecté`)
            }
        }

        infos = clientInformationObject(undefined, getErrorMessage("Vous avez été déconnecté."))
    }
    catch(error) {
        infos = clientInformationObject(getErrorMessage(error), undefined)
    }
    finally {
        await req.session.destroy()
    }

    return res.status(401).render('auth', {
        infos
    })
})

module.exports = router
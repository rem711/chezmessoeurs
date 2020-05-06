const express = require('express')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const { Utilisateurs } = global.db
const logger = require('../utils/logger')

router
.post('/authentification', async (req, res) => {
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
            throw "Pas d'utilisateur avec ce login"
        }

        // vérification du mot de passe
        const isMatch = await bcrypt.compare(postPasswd, user.Password)

        // mot de passe incorrect
        if(!isMatch) {
            throw "Combinaison incorrecte"
        }

        req.session.authenticated = true

        logger.info(`${user.Login} s'est connecté`)
        res.redirect('/')
    }
    catch(error) {
        logger.warn(`Une tentative de connexion a eu lieu en utilisant la combinaison : (${postLogin} || ${postPasswd}) depuis l'adresse : ${req.header('x-forwarded-for') || req.connection.remoteAdress}`)
        res.render('auth', { error : `Identifiant ou mot de passe incorrect.` })
    }
})

module.exports = router
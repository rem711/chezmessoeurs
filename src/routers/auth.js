const express = require('express')
const router = new express.Router()

router
.post('/authentification', (req, res) => {
    const postPasswd = req.body.password

    if(postPasswd === 'demo@2020crm-CMS') {
        req.session.authenticated = true
        res.redirect('/')
    }
    else {
        res.render('auth', { error : `Mot de passe ${postPasswd} incorrect.` })
    }
})

module.exports = router
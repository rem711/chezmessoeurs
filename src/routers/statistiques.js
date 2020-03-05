const express = require('express')
const router = new express.Router()

router
// statistiques
.get('/statistiques', (req, res) => {
    res.render('index', {
        isStatistiques : true
    })
})

module.exports = router
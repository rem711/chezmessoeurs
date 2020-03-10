const express = require('express')
const router = new express.Router()

// la gestion des recettes se fera ici

router
// carte
.get('/carte', (req, res) => {
    res.render('index', {
        isCarte : true
    })
})

module.exports = router
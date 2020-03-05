const express = require('express')
const router = new express.Router()

router
// crée un devis
.post('/devis', (req, res) => {
    const devis = req.body
    res.render('devis', {
        titrePage : 'Création d\'un nouveau devis'
    })
})
// tableau devis
.get('/devis', (req, res) => {
    res.render('index', {
        isDevis : true
    })
})
// devis spécifique
.get('/devis/:id', (req, res) => {
    const idDevis = req.params.id
    res.render('devis', {
        titrePage : `Devis n° ${idDevis}`
    })
})
// modifie un devis
.post('/devis/:id', (req, res) => {
    const idDevis = req.params.id
    res.render('devis', {
        titrePage : `Modification du devis n° ${idDevis}`
    })
})
.delete('/devis/:id', (req, res) => {
    const idDevis = req.params.id
    res.render('devis', {
        titrePage : `Suppression du devis n° ${idDevis}`
    })
})

module.exports = router
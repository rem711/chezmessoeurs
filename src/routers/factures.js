const express = require('express')
const router = new express.Router()

router
// création facture
.post('/factures', (req, res) => {
    const facture = req.body
    res.render('devis', {
        titrePage : 'Création nouvelle facture'
    })
})
// tableau factures
.get('/factures', (req, res) => {
    res.render('index', {
        isFactures : true
    })
})
// facture spécifique
.get('/factures/:id', (req, res) => {
    const idFacture = req.params.id
    res.send(`Facture n° ${idFacture}`)
})
// modification facture
.patch('/factures/:id', (req, res) => {
    const idFacture = req.params.id
    res.render('devis', {
        titrePage : `Modification de la facture ${idFacture}`
    })
})
// suppression facture
.patch('/factures/:id', (req, res) => {
    const idFacture = req.params.id
    res.render('devis', {
        titrePage : `Suppression de la facture ${idFacture}`
    })
})

module.exports = router
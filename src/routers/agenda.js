const express = require('express')
const router = new express.Router()

router
// ajoute à l'agenda
.post('/agenda', (req, res) => {
    const reservation = req.body
    res.render('agenda', {
        titrePage: 'Ajout d\'un élément à l\'agenda'
    })
})
// agenda
.get('/agenda', (req, res) => {
    res.render('index', {
        isAgenda : true
    })
})
// modifie l'agenda
.patch('/agenda/:id', (req, res) => {
    const idReservation = req.params.id
    res.render('agenda', {
        titrePage: `Modification de la réservation ${idReservation}`
    })
})
.delete('/agenda/:id', (req, res) => {
    const idReservation = req.params.id
    res.render('agenda', {
        titrePage: `Suppression de la réservation ${idReservation}`
    })
})

module.exports = router
const express = require('express')
const router = new express.Router()
const { Clients, Estimations } = global.db
const errorHandler = require('../utils/errorHandler')

router
// estimations
.get('/estimations', (req, res) => {
    // res.render('index', {
    //     isEstimations : true
    // })

    let infos = undefined
    let estimations = undefined

    try {
        estimations = Estimations.findAll()
    }
    catch(error) {
        infos = errorHandler(error, undefined)
    }

    res.send({
        infos,
        estimations
    })
})

module.exports = router
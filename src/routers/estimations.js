const express = require('express')
const router = new express.Router()
const { Clients, Estimations } = global.db
const errorHandler = require('../utils/errorHandler')

router
// estimations
.get('/estimations', async (req, res) => {
    // res.render('index', {
    //     isEstimations : true
    // })

    let infos = undefined
    let estimations = undefined
    let clients = undefined

    try {
        estimations = await Estimations.findAll({})
        clients = await Clients.findAll({})
    }
    catch(error) {
        infos = errorHandler(error, undefined)
    }

    res.send({
        infos,
        clients,
        estimations
    })
})

module.exports = router
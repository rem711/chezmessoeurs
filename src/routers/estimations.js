const express = require('express')
const router = new express.Router()

router
// estimations
.get('/estimations', (req, res) => {
    res.render('index', {
        isEstimations : true
    })
})

module.exports = router
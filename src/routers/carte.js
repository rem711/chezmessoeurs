const express = require('express')
const router = new express.Router()

router
// carte
.get('/carte', (req, res) => {
    res.render('index', {
        isCarte : true
    })
})

module.exports = router
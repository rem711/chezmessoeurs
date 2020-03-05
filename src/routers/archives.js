const express = require('express')
const router = new express.Router()

router
// archives
.get('/archives', (req, res) => {
    res.render('index', {
        isArchives : true
    })
})

module.exports = router
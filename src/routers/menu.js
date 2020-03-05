const express = require('express')
const router = new express.Router()

router
// tableau menus
.get('/menu', (req, res) => {
    res.render('menu', {
        titrePage : 'Menu'
    })
})

module.exports = router
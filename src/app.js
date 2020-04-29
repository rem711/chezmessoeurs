// Chargement des bibliothèques
const path = require('path')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const auth = require('./middlewares/authentification/auth')
// const hbs = require('hbs') pour handlebars

// chargement base de données
const db = require('./models')
// la base de données est disponible globalement l'instancier qu'une fois et utiliser son pool
global.db = db 

// chargement des routers
const authRouter = require('./routers/auth')
const agendaRouter = require('./routers/agenda')
const archivesRouter = require('./routers/archives')
const carteRouter = require('./routers/carte')
const clientsRouter = require('./routers/clients').router
const devisRouter = require('./routers/devis').router
const estimationsRouter = require('./routers/estimations')
const facturesRouter = require('./routers/factures').router
const menuRouter = require('./routers/menu')
const statistiquesRouter = require('./routers/statistiques')

const app = express()
app.use(compression())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.use(session({
    name : 'session',
    secret : 'crm chezmessoeurs @Rémi Qualicom',
    resave: false,
    saveUninitialized: true
}))
app.use(auth)

// chemins pour config Express
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, './views')
const partialsPath = path.join(__dirname, './templates/partials')

// setup handlebars engine et le chemin des vues
// lignes 1 et 2 pour utiliser des .html plutôt que .hbs avec handlebars
app.set('view engine', 'html'); // 1
// app.engine('html', require('hbs').__express); // 2 pour handlebars
app.engine('html', require('ejs').__express)
// app.set('view engine', 'hbs')
app.set('views', viewsPath)
// hbs.registerPartials(partialsPath) pour handlebars

// setup chemins des fichiers statics
app.use(express.static(publicDirectoryPath))

// setup des routers
app.use(authRouter)
app.use(agendaRouter)
app.use(archivesRouter)
app.use(carteRouter)
app.use(clientsRouter)
app.use(devisRouter)
app.use(facturesRouter)
app.use(estimationsRouter)
app.use(menuRouter)
app.use(statistiquesRouter)

app
// entrée
.get('', (req, res) => {
    res.render('index', {
        
    })
})

module.exports = app
// Chargement des bibliothèques
const path = require('path')
const compression = require('compression')
const express = require('express')
const keepHTTPS = require('./middlewares/https/keepHTTPS')
const bodyParser = require('body-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const crypto = require('crypto')
const authMiddleware = require('./middlewares/authentification/auth')
const errorMiddleware = require('./middlewares/erreurs/errorHandler')
const error404Middleware = require('./middlewares/erreurs/404-handler')
const logger = require('./utils/logger')
const morgan = require('morgan')

// chargement base de données
const db = require('./models')
// la base de données est disponible globalement l'instancier qu'une fois et utiliser son pool
global.db = db 

// chargement des routers
const authRouter = require('./routers/auth')
const agendaRouter = require('./routers/agenda')
const clientsRouter = require('./routers/clients').router
const ventesRouter = require('./routers/ventes')
const facturesRouter = require('./routers/factures').router
const statistiquesRouter = require('./routers/statistiques')

const app = express()
// if(process.env.NODE_ENV === 'production') {
//     app.enable('trust proxy')
//     app.use(keepHTTPS)
// }
// app.use((req, res, next) => {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next();
// })
app.use(morgan('short', { stream : logger.stream }))
app.use(compression())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.use(session({
    name : 'session',
    // valide pour 24h
    cookie : { maxAge : 86400000 },
    store : new MemoryStore({
        checkPeriod : 86400000
    }),
    secret : crypto.randomBytes(20).toString('hex'),
    // don't save session if unmodified
    resave: false, 
    // create session until something stored
    saveUninitialized: true 
}))
app.use(authMiddleware)

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
app.use(clientsRouter)
app.use(ventesRouter)
app.use(facturesRouter)
app.use(statistiquesRouter)

app
// entrée
.get('', (req, res) => {
    // res.render('index', {
        
    // })
    res.redirect('/agenda')
})

app.use(errorMiddleware)
app.use(error404Middleware)

module.exports = app
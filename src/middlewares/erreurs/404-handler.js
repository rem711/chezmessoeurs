const logger = require('../../utils/logger')

module.exports = (req, res, next) => {
    logger.warn(`Tentative d'accès à la ressource [${req.method} ${req.originalUrl}] depuis l'adresse : ${req.header('x-forwarded-for') || req.connection.remoteAdress}`)
    res.status(404).send("La resource demandée n'est pas accessible.")
}
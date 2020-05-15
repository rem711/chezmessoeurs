const logger = require('../../utils/logger')

module.exports = (err, req, res, next) => {
    logger.log({ level : 'error', message : err})
    
    return res.status(500).send('Une erreur est survenue sur le serveur, veuillez en informer votre Webmaster.')
}
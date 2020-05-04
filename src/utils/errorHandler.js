// les paramètres sont la string à afficher 
// celui qui n'est pas utile est undefined

/**
 * Create information object to send to the client to give feedback
 * @param {string} [error = undefined] String error
 * @param {string} [message = undefined] String message
 * @returns {Object} infos
 * @returns {string} error - Error message if there is one
 * @returns {string} message - Message if there is one
 */
const clientInformationObject = (error = undefined, message = undefined) => {
    // mauvaise utilisation
    if(error === undefined && message === undefined) {
        error = 'Une erreur s\'est produite, veuillez recharger la page.'
    }
    // s'il y a une erreur, mais qu'un message a tout de même été obtenu,
    // on souhaite afficher que l'erreur car le message est certainement faux
    if(error !== undefined && message !== undefined) {
        message = undefined
    }

    const infos = {
        error,
        message
    } 

    return infos
}

/**
 * Returns error message from an Error
 * @param {Object | string} error - ErrorObject thrown or string
 * @returns {string} Error message
 */
const getErrorMessage = (error) => {
    let message = 'Une erreur est survenue sur le serveur, veuillez en informer votre Webmaster.'
    console.log(error)

    try {
        // cas trivial, message déjà récupéré ou erreur custom avec throw 'mystring'
        if(typeof error === 'string') {
            message =  error
        }
        else if(error.name === 'SequelizeValidationError') {
            message =  error.errors[0].message
        }
        else if(error.name === 'SequelizeDatabaseError') {
            message = error.parent.sqlMessage
        }
        else if(error.name === 'SequelizeConnectionRefusedError') {
            message = "La connexion à la base de données est interrompue, veuillez réessayer plus tard. Si l'erreur persiste, veuillez en informer votre Webmaster."
        }
    }
    catch(e) {
        console.log(e)
    }

    return message
}

module.exports = {
    clientInformationObject,
    getErrorMessage
}
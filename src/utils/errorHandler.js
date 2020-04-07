// les paramètres sont la string à afficher 
// celui qui n'est pas utile est undefined
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

// prend une erreur et retourne le message de celle-ci
// @params : ErrorObject
// @retrun : String message
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
    }
    catch(e) {
        console.log(e)
    }
    finally {
        return message
    }
}

module.exports = {
    clientInformationObject,
    getErrorMessage
}
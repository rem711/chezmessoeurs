// les paramètres sont la string à afficher 
// celui qui n'est pas utile est undefined
const errorHandler = (error = undefined, message = undefined) => {
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

module.exports = errorHandler
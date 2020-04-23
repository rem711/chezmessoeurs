const { Remises } = global.db

const createOrLoadRemise = async (postRemise) => {
    let remise = undefined

    // gestion des paramètres
    // Nom
    if(postRemise.Nom === undefined || postRemise.Nom === 'undefined' || postRemise.Nom === '') {
        throw 'Le nom de la remise doit être défini.'
    }
    postRemise.Nom = postRemise.Nom.trim()
    if(!(postRemise.Nom.length >= 3 && postRemise.Nom.length <= 1000)) {
        throw 'Le nom de la remise doit être compris entre 3 et 1000 caractères.'
    }

    // IsPourcent
    if(postRemise.IsPourcent === undefined || postRemise.IsPourcent === 'undefined') {
        throw "L'option Pourcentage ou Valeur de la remise doit être sélectionnée."
    }
    postRemise.IsPourcent = Boolean(postRemise.IsPourcent)
    // cast en nombre car stocké sous cette forme 1=true 0=false
    postRemise.IsPourcent = Number(postRemise.IsPourcent)

    // Valeur
    if(postRemise.Valeur === undefined || postRemise.Valeur === 'undefined') {
        throw 'La valeur de la remise doit être définie.'
    }
    postRemise.Valeur = postRemise.Valeur.toString()
    postRemise.Valeur = postRemise.Valeur.replace(',', '.')
    postRemise.Valeur = Number(Number(postRemise.Valeur).toFixed(2))
    if(postRemise.Valeur <= 0) {
        throw "La valeur de la remise doit être positive."
    }
    // vérification que le pourcentage ne soit pas trop élevé
    if(postRemise.IsPourcent && postRemise.Valeur > 100) {
        throw "Le pourcentage de remise ne peut pas être supérieur à 100%."
    }

    // vérifiacation de l'existence en BDD
    remise = await Remises.findOne({
        where : {
            Nom : postRemise.Nom,
            IsPourcent : postRemise.IsPourcent,
            Valeur : postRemise.Valeur
        }
    })

    // aucune remise avec ces attributs
    if(remise === null) {
        remise = await Remises.create({
            Nom : postRemise.Nom,
            IsPourcent : postRemise.IsPourcent,
            Valeur : postRemise.Valeur
        })

        if(!(remise instanceof Remises)) {
            throw "Une erreur s'est produite lors de la création de la remise. Veuillez réessayer plus tard."
        }
    }

    return remise
}

// eslint-disable-next-line require-await
// await automatically done by return statement in async function
const getRemise = async (Id_Remise) => {
    if(Id_Remise === null) {
        throw "Une erreur est survenue avec la remise demandée."
    }

    return Remises.findOne({
        where : {
            Id_Remise
        }
    })
}

module.exports = {
    createOrLoadRemise,
    getRemise
}